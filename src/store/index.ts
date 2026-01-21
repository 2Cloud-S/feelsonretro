import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { AppState, Settings, Article, Channel, ViewMode, BookmarkedArticle } from '@/types';
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

      // Bookmarks and read tracking
      bookmarks: [],
      readArticles: [],

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
        // Mark as read when selecting
        if (article) {
          get().markAsRead(article.id);
        }
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

      // Bookmark actions
      addBookmark: (article: Article) => {
        const { bookmarks } = get();
        if (bookmarks.some((b) => b.id === article.id)) return;

        const bookmarkedArticle: BookmarkedArticle = {
          ...article,
          bookmarkedAt: Date.now(),
        };

        set((state) => ({
          bookmarks: [bookmarkedArticle, ...state.bookmarks],
        }));
      },

      removeBookmark: (articleId: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== articleId),
        }));
      },

      isBookmarked: (articleId: string) => {
        return get().bookmarks.some((b) => b.id === articleId);
      },

      // Read tracking
      markAsRead: (articleId: string) => {
        const { readArticles } = get();
        if (readArticles.includes(articleId)) return;

        set((state) => ({
          // Keep only last 500 read articles to prevent storage bloat
          readArticles: [articleId, ...state.readArticles].slice(0, 500),
        }));
      },

      isRead: (articleId: string) => {
        return get().readArticles.includes(articleId);
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
        bookmarks: state.bookmarks,
        readArticles: state.readArticles,
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
export const useBookmarks = () => useStore((state) => state.bookmarks);
export const useReadArticles = () => useStore((state) => state.readArticles);
