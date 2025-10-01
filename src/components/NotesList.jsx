// components/NotesList.jsx
import React from 'react';
import NoteCard from './NoteCard';

const NotesList = ({ notes, selectedNoteId, onSelectNote, onPinNote, onDeleteNote, searchTerm }) => {
  // Filter notes based on search term
  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(searchLower);
    const contentMatch = note.content?.toLowerCase().includes(searchLower);
    const tagsMatch = note.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    
    return titleMatch || contentMatch || tagsMatch;
  });

  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">
          {searchTerm ? 'No notes found' : 'No notes yet'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-3">
      {filteredNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={onSelectNote}
          onPin={onPinNote}
          onDelete={onDeleteNote}
          isSelected={note.id === selectedNoteId}
        />
      ))}
    </div>
  );
};

export default NotesList;