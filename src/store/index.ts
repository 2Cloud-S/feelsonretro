import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { AppState, Settings, Article, Channel, ViewMode } from '@/types';
import { DEFAULT_CHANNELS } from '@/lib/news/sources';

const DEFAULT_SETTINGS: Settings = {
  viewMode: 'tv',
  theme: 'color',
  fontSize: 'medium',
  soundEnabled: true,
  soundVolume: 0.5,
  scanlineIntensity: 50,
  flickerEnabled: true,
  reducedMotion: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChannel: 1,
      channels: DEFAULT_CHANNELS,
      customChannels: [],
      isTransitioning: false,
      isPoweredOn: true,

      articlesByChannel: {},
      isLoading: false,
      error: null,
      lastFetch: {},

      selectedArticle: null,

      settings: DEFAULT_SETTINGS,

      // Actions
      setChannel: (channel: number) => {
        const { currentChannel, isPoweredOn } = get();
        if (!isPoweredOn || channel === currentChannel) return;

        const allChannels = [...get().channels, ...get().customChannels];
        const channelExists = allChannels.some((c) => c.number === channel);
        if (!channelExists) return;

        set({ isTransitioning: true });

        // Transition effect duration
        setTimeout(() => {
          set({ currentChannel: channel, isTransitioning: false });
        }, 500);
      },

      nextChannel: () => {
        const { currentChannel, channels, customChannels, isPoweredOn } = get();
        if (!isPoweredOn) return;

        const allChannels = [...channels, ...customChannels].sort(
          (a, b) => a.number - b.number
        );
        const currentIndex = allChannels.findIndex(
          (c) => c.number === currentChannel
        );
        const nextIndex = (currentIndex + 1) % allChannels.length;
        get().setChannel(allChannels[nextIndex].number);
      },

      prevChannel: () => {
        const { currentChannel, channels, customChannels, isPoweredOn } = get();
        if (!isPoweredOn) return;

        const allChannels = [...channels, ...customChannels].sort(
          (a, b) => a.number - b.number
        );
        const currentIndex = allChannels.findIndex(
          (c) => c.number === currentChannel
        );
        const prevIndex =
          currentIndex === 0 ? allChannels.length - 1 : currentIndex - 1;
        get().setChannel(allChannels[prevIndex].number);
      },

      togglePower: () => {
        set((state) => ({ isPoweredOn: !state.isPoweredOn }));
      },

      setViewMode: (mode: ViewMode) => {
        set((state) => ({
          settings: { ...state.settings, viewMode: mode },
        }));
      },

      setArticles: (channel: number, articles: Article[]) => {
        set((state) => ({
          articlesByChannel: {
            ...state.articlesByChannel,
            [channel]: articles,
          },
          lastFetch: {
            ...state.lastFetch,
            [channel]: Date.now(),
          },
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      selectArticle: (article: Article | null) => {
        set({ selectedArticle: article });
      },

      updateSettings: (newSettings: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addCustomChannel: (name: string, url: string) => {
        const { channels, customChannels } = get();
        const allChannels = [...channels, ...customChannels];
        const maxNumber = Math.max(...allChannels.map((c) => c.number), 0);
        const newNumber = maxNumber + 1;

        const newChannel: Channel = {
          number: newNumber,
          sourceId: `custom-${newNumber}`,
          name: name,
          shortName: name.substring(0, 6).toUpperCase(),
          category: 'custom',
          color: '#888888',
          isCustom: true,
          customUrl: url,
        };

        set((state) => ({
          customChannels: [...state.customChannels, newChannel],
        }));
      },

      removeCustomChannel: (number: number) => {
        set((state) => ({
          customChannels: state.customChannels.filter(
            (c) => c.number !== number
          ),
        }));
      },

      setTransitioning: (transitioning: boolean) => {
        set({ isTransitioning: transitioning });
      },
    }),
    {
      name: 'feelsonretro-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        currentChannel: state.currentChannel,
        customChannels: state.customChannels,
        settings: state.settings,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCurrentChannel = () => useStore((state) => state.currentChannel);
export const useChannels = () => useStore((state) => state.channels);
export const useCustomChannels = () => useStore((state) => state.customChannels);

// Use shallow comparison to avoid infinite loops with derived state
export const useAllChannels = () =>
  useStore(
    useShallow((state) => [...state.channels, ...state.customChannels])
  );

export const useSettings = () => useStore((state) => state.settings);
export const useIsTransitioning = () => useStore((state) => state.isTransitioning);
export const useIsPoweredOn = () => useStore((state) => state.isPoweredOn);
export const useArticles = (channel: number) =>
  useStore((state) => state.articlesByChannel[channel] || []);
export const useIsLoading = () => useStore((state) => state.isLoading);
export const useError = () => useStore((state) => state.error);
export const useSelectedArticle = () => useStore((state) => state.selectedArticle);
