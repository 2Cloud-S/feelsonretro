'use client';

import { useSettings, useIsPoweredOn, useIsTransitioning } from '@/store';
import StaticNoise from './StaticNoise';
import ChannelDisplay from './ChannelDisplay';

interface TVScreenProps {
  children: React.ReactNode;
}

export default function TVScreen({ children }: TVScreenProps) {
  const settings = useSettings();
  const isPoweredOn = useIsPoweredOn();
  const isTransitioning = useIsTransitioning();

  const showScanlines = settings.scanlineIntensity > 0;
  const showFlicker = settings.flickerEnabled && !settings.reducedMotion;

  return (
    <div
      className={`
        crt-screen relative w-full aspect-[16/10] overflow-hidden
        ${showScanlines ? 'crt-scanlines' : ''}
        crt-rgb
        ${showFlicker ? 'crt-flicker' : ''}
      `}
      style={{
        // Dynamic scanline intensity
        ['--scanline-opacity' as string]: settings.scanlineIntensity / 100 * 0.3,
        // Ensure minimum height for readability
        minHeight: '400px',
      }}
    >
      {/* Screen content */}
      <div
        className={`
          absolute inset-0 p-3 md:p-6 overflow-y-auto
          transition-opacity duration-300
          ${isPoweredOn ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {isPoweredOn && children}
      </div>

      {/* Channel display overlay */}
      <ChannelDisplay />

      {/* Static noise during channel transitions */}
      <StaticNoise isVisible={isTransitioning} />

      {/* Power off screen */}
      {!isPoweredOn && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
        </div>
      )}

      {/* Screen reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </div>
  );
}
