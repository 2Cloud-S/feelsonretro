'use client';

import { useStore, useIsPoweredOn } from '@/store';

export default function PowerButton() {
  const isPoweredOn = useIsPoweredOn();
  const { togglePower } = useStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Power</span>
      <button
        onClick={togglePower}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-500 shadow-lg hover:from-gray-500 hover:to-gray-700 transition-all"
        aria-label={isPoweredOn ? 'Turn off TV' : 'Turn on TV'}
        aria-pressed={isPoweredOn}
      >
        {/* Power indicator LED */}
        <div
          className={`absolute top-1 right-1 w-2 h-2 rounded-full transition-colors ${
            isPoweredOn ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-900'
          }`}
        />
        {/* Power symbol */}
        <svg
          className="w-6 h-6 mx-auto text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v9m0 0a9 9 0 11-9-9"
          />
        </svg>
      </button>
    </div>
  );
}
