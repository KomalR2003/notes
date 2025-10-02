import React, { useState, useEffect } from 'react';
import { Plus, Lock, Unlock, X, Menu } from 'lucide-react';
import TextEditor from './components/TextEditor';
import NotesList from './components/NotesList';
import SearchBar from './components/SearchBar';
import PasswordModal from './components/PasswordModal';
import AIFeatures from './components/AIFeatures';
import { useNotes } from './hooks/useNotes';
import { encryptNote, decryptNote } from './utils/encryption';
import { summarizeNote, suggestTags } from './utils/groqAPI';

function App() {
  const {
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
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, mode: 'lock', noteId: null });
  const [unlockedNotes, setUnlockedNotes] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Select first note on initial load
  useEffect(() => {
    if (!loading && notes.length > 0 && !selectedNote) {
      const sortedNotes = getSortedNotes();
      setSelectedNote(sortedNotes[0]);
    }
  }, [loading, notes, selectedNote, getSortedNotes]);

  const handleCreateNote = () => {
    const newNote = createNote('Untitled Note', '<p>Start writing...</p>');
    setSelectedNote(newNote);
    setSidebarOpen(false);
  };

  const handleSelectNote = (note) => {
    if (note.isLocked && !unlockedNotes.has(note.id)) {
      setPasswordModal({ isOpen: true, mode: 'unlock', noteId: note.id });
    } else {
      setSelectedNote(note);
      setSidebarOpen(false);
    }
  };

  const handleContentChange = (content) => {
    if (selectedNote && !selectedNote.isLocked) {
      updateNote(selectedNote.id, { content });
      setSelectedNote(prev => ({ ...prev, content }));
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (selectedNote) {
      updateNote(selectedNote.id, { title });
      setSelectedNote(prev => ({ ...prev, title }));
    }
  };

  const handleLockNote = () => {
    if (selectedNote) {
      setPasswordModal({
        isOpen: true,
        mode: selectedNote.isLocked ? 'unlock' : 'lock',
        noteId: selectedNote.id
      });
    }
  };

  const handlePasswordSubmit = (password) => {
    const noteId = passwordModal.noteId;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (passwordModal.mode === 'lock') {
      const encrypted = encryptNote(note.content, password);
      setNoteLock(noteId, true, encrypted);
      if (selectedNote?.id === noteId) setSelectedNote({ ...note, isLocked: true, content: encrypted });
    } else {
      const decrypted = decryptNote(note.content, password);
      if (decrypted) {
        setUnlockedNotes(prev => new Set([...prev, noteId]));
        setSelectedNote({ ...note, content: decrypted });
      } else alert('Incorrect password!');
    }
  };

  const handleAddTags = (tags) => {
    if (selectedNote) {
      addTags(selectedNote.id, tags);
      setSelectedNote(prev => ({ ...prev, tags: [...new Set([...(prev.tags || []), ...tags])] }));
    }
  };

  const handleRemoveTag = (tag) => {
    if (selectedNote) {
      removeTag(selectedNote.id, tag);
      setSelectedNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    }
  };

  const handleApplyCorrection = (error, correction) => {
    if (selectedNote && selectedNote.content) {
      const newContent = selectedNote.content.replace(error, correction);
      handleContentChange(newContent);
    }
  };

  // ✅ AI helpers
  const handleSummarize = async () => {
    if (!selectedNote) return;
    setAiLoading(true);
    try {
      const summary = await summarizeNote(selectedNote.content);
      alert(`Summary:\n${summary}`);
    } catch (err) {
      console.error(err);
      alert("Failed to summarize note");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!selectedNote) return;
    setAiLoading(true);
    try {
      const tags = await suggestTags(selectedNote.content);
      handleAddTags(tags);
    } catch (err) {
      console.error(err);
      alert("Failed to suggest tags");
    } finally {
      setAiLoading(false);
    }
  };

  const isNoteLocked = selectedNote?.isLocked && !unlockedNotes.has(selectedNote.id);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-1 sm:gap-2">
              <span className="hidden xs:inline">Shareable</span> Notes
            </h1>
          </div>
          <button
              onClick={handleCreateNote}
              className="flex items-center gap-1 sm:gap-2 bg-white text-purple-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Note</span>
              <span className="sm:hidden">New</span>
            </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 sm:w-72 md:w-80 lg:w-80 xl:w-96 bg-white border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <NotesList
              notes={getSortedNotes()}
              selectedNoteId={selectedNote?.id}
              onSelectNote={handleSelectNote}
              onPinNote={togglePin}
              onDeleteNote={deleteNote}
              searchTerm={searchTerm}
            />
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedNote ? (
            <>
              <div className="bg-white border-b border-gray-300 p-3 sm:p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={handleTitleChange}
                    className="flex-1 text-lg sm:text-xl md:text-2xl font-bold focus:outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors"
                    placeholder="Note title..."
                    disabled={isNoteLocked}
                  />
                  <button
                    onClick={handleLockNote}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${selectedNote.isLocked ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title={selectedNote.isLocked ? 'Unlock note' : 'Lock note'}
                  >
                    {selectedNote.isLocked ? <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> : <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>

                {selectedNote.tags && selectedNote.tags.length > 0 && !isNoteLocked && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {selectedNote.tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:bg-blue-200 rounded-full p-0.5">
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <TextEditor content={selectedNote.content} onChange={handleContentChange} isLocked={isNoteLocked} />
              </div>

              {!isNoteLocked && (
                <div className="p-3 sm:p-4 border-t border-gray-300 bg-gray-50 overflow-y-auto max-h-72 sm:max-h-80 md:max-h-96">
                  <AIFeatures content={selectedNote.content} onAddTags={handleAddTags} onApplyCorrection={handleApplyCorrection} />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 p-4">
              <div className="text-center">
                <Plus className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3" />
                <p className="text-lg sm:text-xl font-medium">No note selected</p>
                <p className="text-xs sm:text-sm mt-1">Create a new note or select one from the list</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={passwordModal.isOpen}
        onClose={() => setPasswordModal({ isOpen: false, mode: 'lock', noteId: null })}
        onSubmit={handlePasswordSubmit}
        mode={passwordModal.mode}
        title={notes.find(n => n.id === passwordModal.noteId)?.title}
      />
    </div>
  );
}

export default App;
