'use client';

import { useSettings } from '@/store';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import TVFrame from '@/components/tv/TVFrame';
import NewsContent from '@/components/tv/NewsContent';
import NewspaperLayout from '@/components/newspaper/NewspaperLayout';
import KeyboardShortcutsHelp from '@/components/shared/KeyboardShortcutsHelp';
import BookmarksPanel from '@/components/shared/BookmarksPanel';

export default function Home() {
  const settings = useSettings();

  // Initialize keyboard navigation
  useKeyboardNav();

  // Initialize sound effects
  useSoundEffects();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Render based on view mode
  if (settings.viewMode === 'newspaper') {
    return (
      <>
        <NewspaperLayout />
        <KeyboardShortcutsHelp />
        <BookmarksPanel />
      </>
    );
  }

  // Default: TV Mode
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <TVFrame>
        <NewsContent />
      </TVFrame>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-600">
        <p>Press <kbd className="px-1 bg-gray-800 rounded">?</kbd> for keyboard shortcuts</p>
        <p>Use <kbd className="px-1 bg-gray-800 rounded">1-9</kbd> or <kbd className="px-1 bg-gray-800 rounded">↑↓</kbd> to change channels</p>
      </div>

      <KeyboardShortcutsHelp />
      <BookmarksPanel />
    </main>
  );
}
