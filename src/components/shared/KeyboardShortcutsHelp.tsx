'use client';

import { useEffect, useState } from 'react';
import { KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';
import { useSettings } from '@/store';

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useSettings();
  const isNewspaperMode = settings.viewMode === 'newspaper';

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true);
    window.addEventListener('show-shortcuts-help', handleShowHelp);
    return () => window.removeEventListener('show-shortcuts-help', handleShowHelp);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`max-w-md w-full mx-4 p-6 rounded-lg ${
          isNewspaperMode
            ? 'bg-amber-50 border-2 border-black'
            : 'bg-gray-900 border border-gray-700'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isNewspaperMode ? 'text-black' : 'text-white'}`}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded ${
              isNewspaperMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className={`flex items-center justify-between py-2 border-b ${
                isNewspaperMode ? 'border-gray-300' : 'border-gray-700'
              }`}
            >
              <span className={isNewspaperMode ? 'text-gray-700' : 'text-gray-300'}>
                {shortcut.description}
              </span>
              <kbd
                className={`px-2 py-1 rounded text-sm font-mono ${
                  isNewspaperMode
                    ? 'bg-gray-200 text-gray-800 border border-gray-400'
                    : 'bg-gray-800 text-green-400 border border-gray-600'
                }`}
              >
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className={`mt-4 text-sm ${isNewspaperMode ? 'text-gray-600' : 'text-gray-500'}`}>
          Press <kbd className="px-1 rounded bg-gray-700 text-xs">?</kbd> anytime to show this help
        </p>
      </div>
    </div>
  );
}
