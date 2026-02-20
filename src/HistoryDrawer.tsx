import { useState } from 'react';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import type { Note } from './types';
import { format } from 'date-fns';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

export const HistoryDrawer = ({ isOpen, onClose, notes, onNoteClick, onDelete, onPin }: HistoryDrawerProps) => {
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Drawer
      expanded={isOpen}
      position="end"
      mode="overlay"
      width={400}
      onOverlayClick={onClose}
    >
      <DrawerContent>
        <div className="h-screen bg-gradient-to-b from-yellow-50 to-amber-50 text-gray-900 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">History</h2>
            <Button onClick={onClose} fillMode="flat" icon="close" />
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.value || '')}
            placeholder="Search notes..."
            className="mb-4 w-full"
          />

          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl p-4 hover:bg-yellow-50 transition cursor-pointer border-2 border-yellow-200 shadow-md"
                onClick={() => onNoteClick(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-600 font-medium">
                    {format(note.createdAt, 'MMM d, yyyy h:mm a')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPin(note.id);
                      }}
                      className="text-2xl hover:scale-110 transition"
                    >
                      {note.isPinned ? '📌' : '📍'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this note?')) onDelete(note.id);
                      }}
                      className="text-2xl hover:scale-110 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm line-clamp-3 text-gray-800">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-yellow-200 text-gray-900 px-2 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
