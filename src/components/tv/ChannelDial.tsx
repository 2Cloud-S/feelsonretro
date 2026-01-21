'use client';

import { useState, useRef, useCallback } from 'react';
import { useStore, useCurrentChannel, useAllChannels, useIsPoweredOn } from '@/store';

export default function ChannelDial() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const isPoweredOn = useIsPoweredOn();
  const { nextChannel, prevChannel } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);

  // Calculate rotation based on channel
  const totalChannels = allChannels.length;
  const channelIndex = allChannels.findIndex((c) => c.number === currentChannel);
  const rotation = (channelIndex / totalChannels) * 360;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPoweredOn) return;
    setIsDragging(true);

    const dial = dialRef.current;
    if (!dial) return;

    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    lastAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  }, [isPoweredOn]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isPoweredOn) return;

    const dial = dialRef.current;
    if (!dial) return;

    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const angleDiff = currentAngle - lastAngleRef.current;

    // Threshold for channel change (about 30 degrees)
    if (Math.abs(angleDiff) > 0.5) {
      if (angleDiff > 0) {
        nextChannel();
      } else {
        prevChannel();
      }
      lastAngleRef.current = currentAngle;
    }
  }, [isDragging, isPoweredOn, nextChannel, prevChannel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isPoweredOn) return;
    nextChannel();
  }, [isPoweredOn, nextChannel]);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Channel</span>
      <div
        ref={dialRef}
        className={`channel-dial ${!isPoweredOn ? 'opacity-50' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        role="slider"
        aria-label="Channel dial"
        aria-valuemin={1}
        aria-valuemax={totalChannels}
        aria-valuenow={currentChannel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (!isPoweredOn) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            nextChannel();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            prevChannel();
          }
        }}
      />
    </div>
  );
}
