'use client';

import Link from 'next/link';
import TVScreen from './TVScreen';
import ChannelDial from './ChannelDial';
import ChannelButtons from './ChannelButtons';
import PowerButton from './PowerButton';
import ModeToggle from '../shared/ModeToggle';

interface TVFrameProps {
  children: React.ReactNode;
}

export default function TVFrame({ children }: TVFrameProps) {
  return (
    <div className="w-full max-w-[95vw] xl:max-w-7xl mx-auto px-2">
      {/* TV Cabinet */}
      <div className="tv-cabinet wood-grain p-3 md:p-6">
        {/* Brand name */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <Link
            href="/settings"
            className="text-xs text-amber-200/50 hover:text-amber-200/80 transition-colors"
          >
            Settings
          </Link>
          <span className="text-base md:text-xl font-bold text-amber-200/80 tracking-[0.2em] md:tracking-[0.3em] uppercase">
            FeelsOnRetro
          </span>
          <div className="w-12 md:w-16" />
        </div>

        {/* Screen Area - Larger for better readability */}
        <div className="bg-gray-900 p-1 md:p-3 rounded-lg mb-3 md:mb-4">
          <TVScreen>{children}</TVScreen>
        </div>

        {/* Control Panel - Compact */}
        <div className="flex items-center justify-between px-1 md:px-4">
          {/* Left: Power & Mode Toggle */}
          <div className="flex items-center gap-3 md:gap-6">
            <PowerButton />
            <ModeToggle />
          </div>

          {/* Center: Speaker Grille */}
          <div className="speaker-grille w-24 h-12 hidden lg:block" />

          {/* Right: Channel Controls */}
          <div className="flex items-center gap-3 md:gap-6">
            <ChannelButtons />
            <ChannelDial />
          </div>
        </div>
      </div>

      {/* TV Stand (decorative) - smaller */}
      <div className="flex justify-center mt-1">
        <div className="w-32 md:w-48 h-3 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg" />
      </div>
    </div>
  );
}
