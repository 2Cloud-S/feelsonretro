'use client';

import { useStore, useSettings } from '@/store';

export default function ModeToggle() {
  const settings = useSettings();
  const { setViewMode } = useStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Mode</span>
      <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('tv')}
          className={`
            px-3 py-1.5 text-xs font-bold uppercase rounded
            transition-all duration-200
            ${
              settings.viewMode === 'tv'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
          aria-pressed={settings.viewMode === 'tv'}
        >
          TV
        </button>
        <button
          onClick={() => setViewMode('newspaper')}
          className={`
            px-3 py-1.5 text-xs font-bold uppercase rounded
            transition-all duration-200
            ${
              settings.viewMode === 'newspaper'
                ? 'bg-amber-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
          aria-pressed={settings.viewMode === 'newspaper'}
        >
          Paper
        </button>
      </div>
    </div>
  );
}
