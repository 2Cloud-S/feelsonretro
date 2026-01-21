'use client';

import { useEffect } from 'react';
import { useStore, useIsPoweredOn } from '@/store';

export function useKeyboardNav() {
  const isPoweredOn = useIsPoweredOn();
  const { nextChannel, prevChannel, setChannel, togglePower } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          if (isPoweredOn) {
            e.preventDefault();
            nextChannel();
          }
          break;

        case 'ArrowDown':
        case 'ArrowLeft':
          if (isPoweredOn) {
            e.preventDefault();
            prevChannel();
          }
          break;

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (isPoweredOn) {
            e.preventDefault();
            setChannel(parseInt(e.key));
          }
          break;

        case 'p':
        case 'P':
          e.preventDefault();
          togglePower();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPoweredOn, nextChannel, prevChannel, setChannel, togglePower]);
}
