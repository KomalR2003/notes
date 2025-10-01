import { useState, useEffect } from 'react';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notes_app_data');
      if (stored) {
        const data = JSON.parse(stored);
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('notes_app_data', JSON.stringify({
          notes,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [notes, loading]);

  // --- Note operations ---

  const createNote = (title = 'Untitled Note', content = '') => {
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      isLocked: false,
      tags: []
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id, updates) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id !== id) return note;

        const updated = {
          ...note,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        return updated;
      })
    );
  };

  const deleteNote = id =>
    setNotes(prev => prev.filter(note => note.id !== id));

  const togglePin = id =>
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );

  const setNoteLock = (id, isLocked, encryptedContent = null) =>
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, isLocked, content: encryptedContent || note.content }
          : note
      )
    );

  const addTags = (id, tags) =>
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, tags: [...new Set([...note.tags, ...tags])] }
          : note
      )
    );

  const removeTag = (id, tag) =>
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, tags: note.tags.filter(t => t !== tag) }
          : note
      )
    );

  const getSortedNotes = () =>
    [...notes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    setNoteLock,
    addTags,
    removeTag,
    getSortedNotes
  };
};