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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? ✨ (Type / for commands)"
              className="w-full h-72 p-8 bg-white text-gray-900 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-yellow-300 font-mono text-lg border-3 border-yellow-300 shadow-2xl"
            />

            {showCommands && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-20 left-8 bg-white rounded-2xl shadow-2xl p-3 z-50 border-2 border-yellow-300"
              >
                {Object.keys(TEMPLATES).map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => applyTemplate(cmd as keyof typeof TEMPLATES)}
                    className="block w-full text-left px-5 py-3 hover:bg-yellow-100 rounded-xl text-gray-900 font-semibold transition-colors"
                  >
                    /{cmd}
                  </button>
                ))}
              </motion.div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleSave(true)}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-500 hover:to-amber-600 transition-all font-bold shadow-xl text-lg transform hover:scale-105"
              >
                📌 Pin
              </button>
              <button
                onClick={() => handleSave()}
                className="flex-1 px-8 py-4 bg-white text-gray-900 rounded-2xl hover:bg-yellow-50 transition-all font-bold shadow-xl border-3 border-yellow-300 text-lg transform hover:scale-105"
              >
                Save
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4 font-medium">
              Press <kbd className="px-2 py-1 bg-yellow-100 rounded">Esc</kbd> or <kbd className="px-2 py-1 bg-yellow-100 rounded">Ctrl+Enter</kbd> to save
            </p>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
