import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@progress/kendo-react-dialogs';
import { motion, AnimatePresence } from 'framer-motion';

interface CaptureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, isPinned?: boolean) => void;
  initialContent?: string;
}

const TEMPLATES = {
  meeting: '## Meeting\n- Date: \n- Attendees: \n- Notes:\n',
  todo: '- [ ] ',
  idea: '#idea\n\n',
  journal: `# ${new Date().toLocaleDateString()}\n\n`
};

export const CaptureDialog = ({ isOpen, onClose, onSave, initialContent = '' }: CaptureDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSave();
    } else if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    } else if (e.key === '/' && content === '') {
      e.preventDefault();
      setShowCommands(true);
    }
  };

  const handleSave = (pin = false) => {
    if (content.trim()) {
      onSave(content, pin);
    }
    onClose();
  };

  const applyTemplate = (template: keyof typeof TEMPLATES) => {
    setContent(TEMPLATES[template]);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          onClose={() => handleSave()}
          className="blink-dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative"
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? (Type / for commands)"
              className="w-full h-64 p-6 bg-amber-50 text-gray-900 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-base"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
            />

            {showCommands && (
              <div className="absolute top-16 left-6 bg-white rounded-lg shadow-xl p-2 z-50">
                {Object.keys(TEMPLATES).map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => applyTemplate(cmd as keyof typeof TEMPLATES)}
                    className="block w-full text-left px-4 py-2 hover:bg-amber-100 rounded text-gray-900"
                  >
                    /{cmd}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                📌 Pin
              </button>
              <button
                onClick={() => handleSave()}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Save (Esc)
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
