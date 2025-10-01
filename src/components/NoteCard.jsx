// components/NoteCard.jsx - Fixed Date Display
import React from 'react';
import { Pin, Lock, Trash2, Calendar } from 'lucide-react';

const NoteCard = ({ note, onClick, onPin, onDelete, isSelected }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset hours to compare only dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const diffTime = today - noteDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    // If more than 1 day ago, show the actual date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getPreview = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const handlePin = (e) => {
    e.stopPropagation();
    if (onPin) {
      onPin(note.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      if (onDelete) {
        onDelete(note.id);
      }
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(note)}
      className={`bg-white rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-purple-500 shadow-lg'
          : note.isPinned
          ? 'border-yellow-300'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="font-semibold text-gray-900 flex-1 truncate text-sm sm:text-base">
          {note.title || 'Untitled Note'}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {note.isLocked && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />}
          <button
            onClick={handlePin}
            className={`p-1 hover:bg-gray-100 rounded transition-colors ${
              note.isPinned ? 'text-yellow-500' : 'text-gray-400'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="w-3 h-3 sm:w-4 sm:h-4" fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors text-gray-400"
            title="Delete note"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
        {note.isLocked ? 'This note is password protected' : getPreview(note.content)}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-0.5">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center text-xs text-gray-500 mt-2">
        <Calendar className="w-3 h-3 mr-1" />
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;