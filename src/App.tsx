import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { v4 as uuidv4 } from 'uuid';
import { CaptureDialog } from './CaptureDialog';
import { HistoryDrawer } from './HistoryDrawer';
import { PinnedNotes } from './PinnedNotes';
import { storage } from './storage';
import type { Note } from './types';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';

function App() {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setNotes(storage.getNotes());
  }, []);

  useHotkeys('ctrl+shift+b, cmd+shift+b', (e) => {
    e.preventDefault();
    setCaptureOpen(true);
  });

  useHotkeys('ctrl+shift+h, cmd+shift+h', (e) => {
    e.preventDefault();
    setHistoryOpen(!historyOpen);
  });

  const handleSave = (content: string, isPinned = false) => {
    const tags = content.match(/#\w+/g) || [];
    
    if (editingNote) {
      storage.updateNote(editingNote.id, { content, isPinned, tags });
      setEditingNote(null);
    } else {
      const note: Note = {
        id: uuidv4(),
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags,
        isPinned,
      };
      storage.addNote(note);
    }
    
    setNotes(storage.getNotes());
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setCaptureOpen(true);
    setHistoryOpen(false);
  };

  const handleDelete = (id: string) => {
    storage.deleteNote(id);
    setNotes(storage.getNotes());
  };

  const handlePin = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      storage.updateNote(id, { isPinned: !note.isPinned });
      setNotes(storage.getNotes());
    }
  };

  const handleUpdatePinned = (id: string, content: string) => {
    storage.updateNote(id, { content });
    setNotes(storage.getNotes());
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Blink
          </h1>
          <p className="text-gray-400 mb-6">Capture thoughts in under 3 seconds</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCaptureOpen(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition"
            >
              ✨ New Note (Ctrl+Shift+B)
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
            >
              📚 History (Ctrl+Shift+H)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-amber-400">{notes.length}</div>
            <div className="text-gray-400 text-sm mt-2">Total Notes</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-amber-400">
              {notes.filter(n => n.isPinned).length}
            </div>
            <div className="text-gray-400 text-sm mt-2">Pinned</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-amber-400">
              {new Set(notes.map(n => new Date(n.createdAt).toDateString())).size}
            </div>
            <div className="text-gray-400 text-sm mt-2">Day Streak</div>
          </div>
        </div>
      </div>

      <CaptureDialog
        isOpen={captureOpen}
        onClose={() => {
          setCaptureOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSave}
        initialContent={editingNote?.content}
      />

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        notes={notes}
        onNoteClick={handleNoteClick}
        onDelete={handleDelete}
        onPin={handlePin}
      />

      <PinnedNotes
        notes={notes}
        onUnpin={handlePin}
        onUpdate={handleUpdatePinned}
      />

      {showNotification && (
        <NotificationGroup style={{ right: 20, bottom: 20, position: 'fixed' }}>
          <Notification
            type={{ style: 'success', icon: true }}
            closable={true}
            onClose={() => setShowNotification(false)}
          >
            <span>✅ Note saved!</span>
          </Notification>
        </NotificationGroup>
      )}
    </div>
  );
}

export default App;
