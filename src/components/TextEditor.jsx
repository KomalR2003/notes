// components/TextEditor.jsx
import React, { useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import { Lock } from 'lucide-react';

const TextEditor = ({
  content = '',
  onChange,
  isLocked = false,
  placeholder = 'Start typing...'
}) => {
  const editorRef = useRef(null);

  // Update editor when content prop changes
  useEffect(() => {
    if (editorRef.current && !isLocked && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content, isLocked]);

  // Apply formatting commands
  const execCommand = (command, value = null) => {
    if (!isLocked) {
      // Special handling for font size
      if (command === 'fontSize') {
        document.execCommand('fontSize', false, value);
      } else if (command === 'fontName') {
        document.execCommand('fontName', false, value);
      } else if (command === 'foreColor' || command === 'backColor') {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false, value);
      }
      
      editorRef.current.focus();
      triggerChange();
    }
  };

  // Trigger onChange with editor content
  const triggerChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Clean paste content - preserve formatting
  const handlePaste = (e) => {
    e.preventDefault();
    
    // Try to get HTML content first (preserves formatting)
    const html = e.clipboardData.getData('text/html');
    if (html) {
      // Clean up the HTML (remove unwanted tags but keep formatting)
      const cleanHtml = html
        .replace(/<meta[^>]*>/g, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      
      document.execCommand('insertHTML', false, cleanHtml);
    } else {
      // Fallback to plain text
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    }
    
    triggerChange();
  };

  // Keyboard shortcuts for formatting
  const handleKeyDown = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    const shortcuts = {
      b: 'bold',
      i: 'italic',
      u: 'underline',
      e: 'justifyCenter',
      l: 'justifyLeft',
      r: 'justifyRight',
      j: 'justifyFull'
    };

    const command = shortcuts[e.key.toLowerCase()];
    if (command) {
      e.preventDefault();
      execCommand(command);
    }
  };

  // Locked note view
  if (isLocked) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <Toolbar onFormat={execCommand} disabled />
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-lg font-medium">This note is locked</p>
          <p className="text-gray-400 text-sm mt-1">Enter password to view content</p>
        </div>
      </div>
    );
  }

  // Editable note view
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Toolbar onFormat={execCommand} disabled={isLocked} />

      <div className="relative">
        {/* Placeholder */}
        {!content && !isLocked && (
          <span className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
            {placeholder}
          </span>
        )}

        <div
          ref={editorRef}
          contentEditable={!isLocked}
          onInput={triggerChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none"
          style={{ 
            wordWrap: 'break-word', 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12pt'
          }}
        />
      </div>

     
    </div>
  );
};

export default TextEditor;