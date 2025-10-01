const NOTES_KEY = "notes_app_data";
const PREFERENCES_KEY = "notes_app_preferences";

const ensureStore = () => {
  if (!window.notesMemoryStore) window.notesMemoryStore = {};
  return window.notesMemoryStore;
};

// Save notes
export const saveNotes = (notes) => {
  try {
    const store = ensureStore();
    store[NOTES_KEY] = { notes, lastUpdated: new Date().toISOString() };
    return true;
  } catch (e) {
    console.error("Error saving notes:", e);
    return false;
  }
};

// Load notes
export const loadNotes = () => {
  try {
    const store = ensureStore();
    return store[NOTES_KEY]?.notes || [];
  } catch (e) {
    console.error("Error loading notes:", e);
    return [];
  }
};

// Save preferences
export const savePreferences = (preferences) => {
  try {
    ensureStore()[PREFERENCES_KEY] = preferences;
    return true;
  } catch (e) {
    console.error("Error saving preferences:", e);
    return false;
  }
};

// Load preferences
export const loadPreferences = () => {
  try {
    return ensureStore()[PREFERENCES_KEY] || {
      theme: "light",
      defaultView: "grid",
      sortBy: "updated",
    };
  } catch (e) {
    console.error("Error loading preferences:", e);
    return {};
  }
};

// Clear all stored data
export const clearAllData = () => {
  try {
    window.notesMemoryStore = {};
    return true;
  } catch (e) {
    console.error("Error clearing data:", e);
    return false;
  }
};

// Export notes as JSON
export const exportNotes = (notes) => {
  try {
    return JSON.stringify(notes, null, 2);
  } catch (e) {
    console.error("Error exporting notes:", e);
    return null;
  }
};

// Import notes from JSON
export const importNotes = (jsonString) => {
  try {
    const notes = JSON.parse(jsonString);
    return Array.isArray(notes) ? notes : null;
  } catch (e) {
    console.error("Error importing notes:", e);
    return null;
  }
};
