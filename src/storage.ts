import type { Note } from './types';

const STORAGE_KEY = 'blink-notes';

export const storage = {
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  addNote: (note: Note) => {
    const notes = storage.getNotes();
    notes.unshift(note);
    storage.saveNotes(notes);
  },

  updateNote: (id: string, updates: Partial<Note>) => {
    const notes = storage.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: Date.now() };
      storage.saveNotes(notes);
    }
  },

  deleteNote: (id: string) => {
    const notes = storage.getNotes().filter(n => n.id !== id);
    storage.saveNotes(notes);
  }
};
