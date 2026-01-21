// News Article Types
export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  originalLink: string;
  pubDate: string;
  source: string;
  sourceName: string;
  image?: string;
  category?: string;
  author?: string;
}

// Bookmarked article with timestamp
export interface BookmarkedArticle extends Article {
  bookmarkedAt: number;
}

// Channel Types
export interface Channel {
  number: number;
  sourceId: string;
  name: string;
  shortName: string;
  category: string;
  color: string;
  isCustom?: boolean;
  customUrl?: string;
}

// News Source Configuration
export interface NewsSource {
  id: string;
  name: string;
  shortName: string;
  type: 'rss';
  url: string;
  category: string;
  color: string;
}

// Store Types
export type ViewMode = 'tv' | 'newspaper';
export type Theme = 'color' | 'green' | 'amber';
export type FontSize = 'small' | 'medium' | 'large';

export interface Settings {
  viewMode: ViewMode;
  theme: Theme;
  fontSize: FontSize;
  soundEnabled: boolean;
  soundVolume: number;
  scanlineIntensity: number;
  flickerEnabled: boolean;
  reducedMotion: boolean;
}

export interface AppState {
  // Channel state
  currentChannel: number;
  channels: Channel[];
  customChannels: Channel[];
  isTransitioning: boolean;
  isPoweredOn: boolean;

  // News state
  articlesByChannel: Record<number, Article[]>;
  isLoading: boolean;
  error: string | null;
  lastFetch: Record<number, number>;

  // Selected article
  selectedArticle: Article | null;

  // Bookmarks
  bookmarks: BookmarkedArticle[];

  // Read articles (for tracking)
  readArticles: string[];

  // Settings
  settings: Settings;

  // Actions
  setChannel: (channel: number) => void;
  nextChannel: () => void;
  prevChannel: () => void;
  togglePower: () => void;
  setViewMode: (mode: ViewMode) => void;
  setArticles: (channel: number, articles: Article[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectArticle: (article: Article | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addCustomChannel: (name: string, url: string) => void;
  removeCustomChannel: (number: number) => void;
  setTransitioning: (transitioning: boolean) => void;

  // Bookmark actions
  addBookmark: (article: Article) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;

  // Read tracking
  markAsRead: (articleId: string) => void;
  isRead: (articleId: string) => boolean;
}

// API Response Types
export interface NewsApiResponse {
  articles: Article[];
  source: string;
  cachedAt: string;
  error?: string;
}
