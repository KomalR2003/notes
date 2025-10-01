// components/Toolbar.jsx
import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Strikethrough,
  Type,
  ChevronDown
} from 'lucide-react';

const Toolbar = ({ onFormat, disabled = false }) => {
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('3');
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial');

  // Font sizes matching Microsoft Word
  const fontSizes = [
    { value: '1', label: '8', size: '8pt' },
    { value: '2', label: '10', size: '10pt' },
    { value: '3', label: '12', size: '12pt' },
    { value: '4', label: '14', size: '14pt' },
    { value: '5', label: '18', size: '18pt' },
    { value: '6', label: '24', size: '24pt' },
    { value: '7', label: '36', size: '36pt' }
  ];

  // Font families matching Word
  const fontFamilies = [
    'Arial',
    'Calibri',
    'Times New Roman',
    'Verdana',
    'Comic Sans MS',
  ];

  const ToolbarButton = ({ icon: Icon, title, command, value = null, isActive = false }) => (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          onFormat(command, value);
        }
      }}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const handleFontSizeChange = (size) => {
    setCurrentFontSize(size);
    onFormat('fontSize', size);
    setShowFontSize(false);
  };

  const handleFontFamilyChange = (font) => {
    setCurrentFontFamily(font);
    onFormat('fontName', font);
    setShowFontFamily(false);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
      {/* Font Family Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setShowFontFamily(!showFontFamily)}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-[140px]"
        >
          <Type className="w-4 h-4" />
          <span className="flex-1 text-left truncate">{currentFontFamily}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {showFontFamily && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-64 overflow-y-auto w-48">
            {fontFamilies.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => handleFontFamilyChange(font)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-sm"
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setShowFontSize(!showFontSize)}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm w-20"
        >
          <span className="flex-1 text-center">
            {fontSizes.find(f => f.value === currentFontSize)?.label || '12'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {showFontSize && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-64 overflow-y-auto w-24">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => handleFontSizeChange(size.value)}
                className="w-full text-center px-3 py-2 hover:bg-blue-50 transition-colors text-sm"
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <ToolbarButton icon={Bold} title="Bold (Ctrl+B)" command="bold" />
      <ToolbarButton icon={Italic} title="Italic (Ctrl+I)" command="italic" />
      <ToolbarButton icon={Underline} title="Underline (Ctrl+U)" command="underline" />
      <ToolbarButton icon={Strikethrough} title="Strikethrough" command="strikeThrough" />

      <div className="w-px h-6 bg-gray-300 mx-1" />

     

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <ToolbarButton icon={AlignLeft} title="Align Left" command="justifyLeft" />
      <ToolbarButton icon={AlignCenter} title="Align Center" command="justifyCenter" />
      <ToolbarButton icon={AlignRight} title="Align Right" command="justifyRight" />
      <ToolbarButton icon={AlignJustify} title="Justify" command="justifyFull" />

      <div className="w-px h-6 bg-gray-300 mx-1" />

    

      {/* Click outside to close dropdowns */}
      {(showFontSize || showFontFamily) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowFontSize(false);
            setShowFontFamily(false);
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;