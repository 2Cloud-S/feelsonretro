'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/store';

export function useKeyboardShortcuts() {
  const {
    currentChannel,
    setChannel,
    selectedArticle,
    selectArticle,
    settings,
    updateSettings
  } = useStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // Channel switching with number keys (1-9)
    if (event.key >= '1' && event.key <= '9' && !event.ctrlKey && !event.metaKey) {
      const channelNum = parseInt(event.key);
      setChannel(channelNum);
      return;
    }

    switch (event.key) {
      // Arrow keys for channel navigation
      case 'ArrowUp':
        if (!selectedArticle) {
          event.preventDefault();
          setChannel(Math.max(1, currentChannel - 1));
        }
        break;
      case 'ArrowDown':
        if (!selectedArticle) {
          event.preventDefault();
          setChannel(Math.min(9, currentChannel + 1));
        }
        break;

      // Escape to close article reader
      case 'Escape':
        if (selectedArticle) {
          selectArticle(null);
        }
        break;

      // M to toggle view mode
      case 'm':
      case 'M':
        if (!event.ctrlKey && !event.metaKey) {
          updateSettings({
            viewMode: settings.viewMode === 'tv' ? 'newspaper' : 'tv'
          });
        }
        break;

      // R to refresh current channel
      case 'r':
      case 'R':
        if (!event.ctrlKey && !event.metaKey) {
          // Trigger a refresh by dispatching a custom event
          window.dispatchEvent(new CustomEvent('refresh-news'));
        }
        break;

      // ? to show keyboard shortcuts help
      case '?':
        window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
        break;

      default:
        break;
    }
  }, [currentChannel, selectedArticle, settings.viewMode, setChannel, selectArticle, updateSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Keyboard shortcuts info for help display
export const KEYBOARD_SHORTCUTS = [
  { key: '1-9', description: 'Switch to channel 1-9' },
  { key: '↑/↓', description: 'Previous/Next channel' },
  { key: 'M', description: 'Toggle TV/Newspaper mode' },
  { key: 'R', description: 'Refresh current channel' },
  { key: 'Esc', description: 'Close article reader' },
  { key: '?', description: 'Show keyboard shortcuts' },
];
