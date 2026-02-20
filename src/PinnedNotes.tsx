import { useState } from 'react';
import { Window } from '@progress/kendo-react-dialogs';
import type { Note } from './types';
import { motion } from 'framer-motion';

interface PinnedNotesProps {
  notes: Note[];
  onUnpin: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export const PinnedNotes = ({ notes, onUnpin, onUpdate }: PinnedNotesProps) => {
  const [minimized, setMinimized] = useState<Set<string>>(new Set());

  const toggleMinimize = (id: string) => {
    setMinimized(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {notes.filter(n => n.isPinned).map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            top: 100 + index * 50,
            right: 20,
            zIndex: 1000 + index,
          }}
        >
          <Window
            title={`Note ${note.id.slice(0, 8)}`}
            onClose={() => onUnpin(note.id)}
            initialWidth={300}
            initialHeight={minimized.has(note.id) ? 50 : 200}
            draggable={true}
            resizable={!minimized.has(note.id)}
            className="pinned-note"
          >
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <button
                  onClick={() => toggleMinimize(note.id)}
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >
                  {minimized.has(note.id) ? '▼' : '▲'}
                </button>
              </div>
              {!minimized.has(note.id) && (
                <textarea
                  value={note.content}
                  onChange={(e) => onUpdate(note.id, e.target.value)}
                  className="w-full h-32 bg-yellow-50 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-900 text-sm border border-yellow-200"
                />
              )}
            </div>
          </Window>
        </motion.div>
      ))}
    </>
  );
};
