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
        <div className="h-screen bg-gray-900 text-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">History</h2>
            <Button onClick={onClose} fillMode="flat" icon="close" />
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.value || '')}
            placeholder="Search notes..."
            className="mb-4 w-full"
          />

          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer"
                onClick={() => onNoteClick(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-400">
                    {format(note.createdAt, 'MMM d, yyyy h:mm a')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPin(note.id);
                      }}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      {note.isPinned ? '📌' : '📍'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this note?')) onDelete(note.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm line-clamp-3">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded">
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
