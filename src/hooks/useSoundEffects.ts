'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSettings, useIsTransitioning, useCurrentChannel } from '@/store';

// Sound URLs (using data URIs for simplicity, can be replaced with actual audio files)
const SOUNDS = {
  channelClick: '/audio/channel-click.mp3',
  staticNoise: '/audio/static.mp3',
};

export function useSoundEffects() {
  const settings = useSettings();
  const isTransitioning = useIsTransitioning();
  const currentChannel = useCurrentChannel();
  const prevChannelRef = useRef(currentChannel);

  // Sound instances
  const channelClickRef = useRef<Howl | null>(null);
  const staticNoiseRef = useRef<Howl | null>(null);

  // Initialize sounds (lazy loading)
  const getChannelClick = useCallback(() => {
    if (!channelClickRef.current) {
      channelClickRef.current = new Howl({
        src: [SOUNDS.channelClick],
        volume: settings.soundVolume,
        preload: true,
      });
    }
    return channelClickRef.current;
  }, [settings.soundVolume]);

  const getStaticNoise = useCallback(() => {
    if (!staticNoiseRef.current) {
      staticNoiseRef.current = new Howl({
        src: [SOUNDS.staticNoise],
        volume: settings.soundVolume * 0.5, // Static is quieter
        preload: true,
      });
    }
    return staticNoiseRef.current;
  }, [settings.soundVolume]);

  // Play channel click sound
  const playChannelClick = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      const sound = getChannelClick();
      sound.volume(settings.soundVolume);
      sound.play();
    } catch (error) {
      // Audio might not be available
      console.log('Could not play channel click sound');
    }
  }, [settings.soundEnabled, settings.soundVolume, getChannelClick]);

  // Play static noise
  const playStaticNoise = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      const sound = getStaticNoise();
      sound.volume(settings.soundVolume * 0.5);
      sound.play();
    } catch (error) {
      console.log('Could not play static noise');
    }
  }, [settings.soundEnabled, settings.soundVolume, getStaticNoise]);

  // Play sounds on channel change
  useEffect(() => {
    if (currentChannel !== prevChannelRef.current) {
      playChannelClick();
      prevChannelRef.current = currentChannel;
    }
  }, [currentChannel, playChannelClick]);

  // Play static during transitions
  useEffect(() => {
    if (isTransitioning) {
      playStaticNoise();
    }
  }, [isTransitioning, playStaticNoise]);

  // Update volume when settings change
  useEffect(() => {
    if (channelClickRef.current) {
      channelClickRef.current.volume(settings.soundVolume);
    }
    if (staticNoiseRef.current) {
      staticNoiseRef.current.volume(settings.soundVolume * 0.5);
    }
  }, [settings.soundVolume]);

  // Cleanup
  useEffect(() => {
    return () => {
      channelClickRef.current?.unload();
      staticNoiseRef.current?.unload();
    };
  }, []);

  return {
    playChannelClick,
    playStaticNoise,
  };
}
