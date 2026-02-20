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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? (Type / for commands)"
              className="w-full h-64 p-6 bg-white text-gray-900 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-yellow-300 font-mono text-base border-3 border-yellow-300 shadow-2xl"
            />

            {showCommands && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 left-6 bg-white rounded-2xl shadow-2xl p-2 z-50 border-2 border-yellow-300"
              >
                {Object.keys(TEMPLATES).map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => applyTemplate(cmd as keyof typeof TEMPLATES)}
                    className="block w-full text-left px-4 py-2 hover:bg-yellow-100 rounded-xl text-gray-900 font-semibold transition-colors"
                  >
                    /{cmd}
                  </button>
                ))}
              </motion.div>
            )}

            <div className="flex justify-between mt-4 gap-3">
              <button
                onClick={() => handleSave(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-500 hover:to-amber-600 transition-all font-bold shadow-xl transform hover:scale-105"
              >
                📌 Pin
              </button>
              <button
                onClick={() => handleSave()}
                className="px-6 py-3 bg-white text-gray-900 rounded-2xl hover:bg-yellow-50 transition-all font-bold shadow-xl border-3 border-yellow-300 transform hover:scale-105"
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
