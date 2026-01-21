'use client';

import { useSettings } from '@/store';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import TVFrame from '@/components/tv/TVFrame';
import NewsContent from '@/components/tv/NewsContent';
import NewspaperLayout from '@/components/newspaper/NewspaperLayout';

export default function Home() {
  const settings = useSettings();

  // Initialize keyboard navigation
  useKeyboardNav();

  // Initialize sound effects
  useSoundEffects();

  // Render based on view mode
  if (settings.viewMode === 'newspaper') {
    return <NewspaperLayout />;
  }

  // Default: TV Mode
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <TVFrame>
        <NewsContent />
      </TVFrame>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-600">
        <p>Use arrow keys or 1-9 to change channels</p>
        <p>Press P to toggle power</p>
      </div>
    </main>
  );
}
