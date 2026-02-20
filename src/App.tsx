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
    <div className="min-h-screen">
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
            Blink
          </h1>
          <p className="text-gray-700 mb-8 text-lg font-medium">Capture thoughts in under 3 seconds</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCaptureOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 rounded-2xl font-bold transition shadow-xl text-gray-900 text-lg"
            >
              ✨ New Note (Ctrl+Shift+B)
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-8 py-4 bg-white hover:bg-yellow-50 rounded-2xl font-bold transition shadow-xl text-gray-900 border-2 border-yellow-300 text-lg"
            >
              📚 History (Ctrl+Shift+H)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border-2 border-yellow-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{notes.length}</div>
            <div className="text-gray-700 text-sm mt-2 font-semibold">Total Notes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border-2 border-yellow-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {notes.filter(n => n.isPinned).length}
            </div>
            <div className="text-gray-700 text-sm mt-2 font-semibold">Pinned</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border-2 border-yellow-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {new Set(notes.map(n => new Date(n.createdAt).toDateString())).size}
            </div>
            <div className="text-gray-700 text-sm mt-2 font-semibold">Day Streak</div>
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
            <span className="font-semibold">✅ Note saved!</span>
          </Notification>
        </NotificationGroup>
      )}
    </div>
  );
}

export default App;
