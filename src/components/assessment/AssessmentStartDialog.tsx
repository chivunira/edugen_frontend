import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, BrainCircuit, Target, X } from 'lucide-react';

const AssessmentStartDialog = ({
  isOpen,
  onClose,
  onConfirm,
  topicName,
  subjectName
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when dialog is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen p-4 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100"
          >
            {/* Header */}
            <div className="relative p-6 pb-3">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ready to Begin?
                </h2>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {topicName}
                </h3>
                <p className="text-gray-600">{subjectName}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                <h4 className="font-bold text-blue-900 mb-4">
                  Before you start:
                </h4>
                <ul className="space-y-4">
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-800">
                      Take your time - you can't pause once the assessment begins
                    </p>
                  </motion.li>
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <BrainCircuit className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-800">
                      Find a quiet space where you can focus without interruptions
                    </p>
                  </motion.li>
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-800">
                      Read each question carefully and review your answers
                    </p>
                  </motion.li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>Start Assessment</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssessmentStartDialog;