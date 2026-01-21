import { NewsSource, Channel } from '@/types';

// News source configurations
export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'google-news-top',
    name: 'Google News - Top Stories',
    shortName: 'GNEWS',
    type: 'rss',
    url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    category: 'general',
    color: '#4285f4',
  },
  {
    id: 'google-news-world',
    name: 'Google News - World',
    shortName: 'GWORLD',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'world',
    color: '#34a853',
  },
  {
    id: 'google-news-tech',
    name: 'Google News - Technology',
    shortName: 'GTECH',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'technology',
    color: '#ea4335',
  },
  {
    id: 'google-news-business',
    name: 'Google News - Business',
    shortName: 'GBIZ',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'business',
    color: '#fbbc05',
  },
  {
    id: 'google-news-science',
    name: 'Google News - Science',
    shortName: 'GSCI',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'science',
    color: '#9c27b0',
  },
  {
    id: 'google-news-health',
    name: 'Google News - Health',
    shortName: 'GHEALTH',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en',
    category: 'health',
    color: '#00bcd4',
  },
  {
    id: 'google-news-sports',
    name: 'Google News - Sports',
    shortName: 'GSPORT',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'sports',
    color: '#ff5722',
  },
  {
    id: 'google-news-entertainment',
    name: 'Google News - Entertainment',
    shortName: 'GENT',
    type: 'rss',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'entertainment',
    color: '#e91e63',
  },
  {
    id: 'bbc-news',
    name: 'BBC News',
    shortName: 'BBC',
    type: 'rss',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'general',
    color: '#bb1919',
  },
];

// Default channel configuration
export const DEFAULT_CHANNELS: Channel[] = [
  {
    number: 1,
    sourceId: 'google-news-top',
    name: 'Google News - Top Stories',
    shortName: 'GNEWS',
    category: 'general',
    color: '#4285f4',
  },
  {
    number: 2,
    sourceId: 'google-news-world',
    name: 'Google News - World',
    shortName: 'GWORLD',
    category: 'world',
    color: '#34a853',
  },
  {
    number: 3,
    sourceId: 'google-news-tech',
    name: 'Google News - Technology',
    shortName: 'GTECH',
    category: 'technology',
    color: '#ea4335',
  },
  {
    number: 4,
    sourceId: 'google-news-business',
    name: 'Google News - Business',
    shortName: 'GBIZ',
    category: 'business',
    color: '#fbbc05',
  },
  {
    number: 5,
    sourceId: 'google-news-science',
    name: 'Google News - Science',
    shortName: 'GSCI',
    category: 'science',
    color: '#9c27b0',
  },
  {
    number: 6,
    sourceId: 'google-news-health',
    name: 'Google News - Health',
    shortName: 'GHEALTH',
    category: 'health',
    color: '#00bcd4',
  },
  {
    number: 7,
    sourceId: 'google-news-sports',
    name: 'Google News - Sports',
    shortName: 'GSPORT',
    category: 'sports',
    color: '#ff5722',
  },
  {
    number: 8,
    sourceId: 'google-news-entertainment',
    name: 'Google News - Entertainment',
    shortName: 'GENT',
    category: 'entertainment',
    color: '#e91e63',
  },
  {
    number: 9,
    sourceId: 'bbc-news',
    name: 'BBC News',
    shortName: 'BBC',
    category: 'general',
    color: '#bb1919',
  },
];

// Get source by ID
export function getSourceById(id: string): NewsSource | undefined {
  return NEWS_SOURCES.find((source) => source.id === id);
}

// Get source URL by ID
export function getSourceUrl(id: string): string | undefined {
  return NEWS_SOURCES.find((source) => source.id === id)?.url;
}
