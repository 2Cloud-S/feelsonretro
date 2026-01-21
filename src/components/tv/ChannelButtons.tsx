'use client';

import { useStore, useCurrentChannel, useIsPoweredOn } from '@/store';

export default function ChannelButtons() {
  const currentChannel = useCurrentChannel();
  const isPoweredOn = useIsPoweredOn();
  const { setChannel } = useStore();

  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Presets</span>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((num) => (
          <button
            key={num}
            onClick={() => isPoweredOn && setChannel(num)}
            disabled={!isPoweredOn}
            className={`
              tv-button flex items-center justify-center
              text-xs font-bold text-gray-300
              ${currentChannel === num ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-800' : ''}
              ${!isPoweredOn ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-label={`Channel ${num}`}
            aria-pressed={currentChannel === num}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
