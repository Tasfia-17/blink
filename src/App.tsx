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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-3xl shadow-2xl mb-4 transform hover:scale-105 transition-transform">
            <span className="text-5xl">⚡</span>
          </div>
          
          <h1 className="text-8xl font-black bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            Blink
          </h1>
          
          <p className="text-xl text-gray-700 font-medium max-w-md mx-auto">
            Capture thoughts in under 3 seconds
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => setCaptureOpen(true)}
              className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 rounded-3xl font-bold transition-all shadow-2xl text-gray-900 text-lg transform hover:scale-105 hover:shadow-yellow-300/50"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <span>New Note</span>
              </span>
              <span className="block text-xs opacity-75 mt-1">Ctrl+Shift+B</span>
            </button>
            
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-10 py-5 bg-white hover:bg-yellow-50 rounded-3xl font-bold transition-all shadow-xl text-gray-900 border-3 border-yellow-300 text-lg transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <span>History</span>
              </span>
              <span className="block text-xs opacity-75 mt-1">Ctrl+Shift+H</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="group bg-white rounded-3xl p-8 text-center shadow-xl border-3 border-yellow-200 hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-2xl">
            <div className="text-6xl font-black bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
              {notes.length}
            </div>
            <div className="text-gray-700 font-bold text-sm uppercase tracking-wide">Total Notes</div>
          </div>
          
          <div className="group bg-white rounded-3xl p-8 text-center shadow-xl border-3 border-yellow-200 hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-2xl">
            <div className="text-6xl font-black bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
              {notes.filter(n => n.isPinned).length}
            </div>
            <div className="text-gray-700 font-bold text-sm uppercase tracking-wide">Pinned</div>
          </div>
          
          <div className="group bg-white rounded-3xl p-8 text-center shadow-xl border-3 border-yellow-200 hover:border-yellow-400 transition-all transform hover:scale-105 hover:shadow-2xl">
            <div className="text-6xl font-black bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
              {new Set(notes.map(n => new Date(n.createdAt).toDateString())).size}
            </div>
            <div className="text-gray-700 font-bold text-sm uppercase tracking-wide">Day Streak</div>
          </div>
        </div>

        {/* Floating Decorations */}
        <div className="fixed top-10 left-10 text-6xl opacity-20 animate-bounce">✨</div>
        <div className="fixed bottom-10 right-10 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>💫</div>
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
