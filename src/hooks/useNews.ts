'use client';

import useSWR from 'swr';
import { useStore, useCurrentChannel, useAllChannels } from '@/store';
import { Article } from '@/types';
import { useEffect } from 'react';
import { getSourceById, getSourceUrl } from '@/lib/news/sources';

interface NewsResponse {
  articles: Article[];
  source: string;
  cachedAt: string;
  fromCache?: boolean;
  error?: string;
}

// Generate a unique ID for an article using a simple hash
function generateArticleId(link: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    const char = link.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${Math.abs(hash).toString(36)}-${index}`;
}

// Strip HTML tags from text
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// RSS to JSON proxy URL (using rss2json.com free tier)
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Fetcher that uses RSS proxy
const fetcher = async (sourceId: string, feedUrl: string): Promise<NewsResponse> => {
  const proxyUrl = `${RSS_PROXY}${encodeURIComponent(feedUrl)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(data.message || 'Failed to parse RSS feed');
  }

  const source = getSourceById(sourceId);

  const articles: Article[] = data.items.slice(0, 20).map((item: {
    title?: string;
    link?: string;
    guid?: string;
    pubDate?: string;
    description?: string;
    content?: string;
    thumbnail?: string;
    enclosure?: { link?: string; type?: string };
  }, index: number) => ({
    id: generateArticleId(item.link || item.guid || '', index),
    title: item.title || 'Untitled',
    description: stripHtml(item.description || item.content || '').slice(0, 300),
    link: item.link || '',
    originalLink: item.link || '',
    pubDate: item.pubDate || new Date().toISOString(),
    source: sourceId,
    sourceName: source?.shortName || sourceId,
    image: item.thumbnail || (item.enclosure?.type?.startsWith('image') ? item.enclosure.link : undefined),
    category: source?.category,
  }));

  return {
    articles,
    source: sourceId,
    cachedAt: new Date().toISOString(),
    fromCache: false,
  };
};

export function useNews() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const { setArticles, setLoading, setError } = useStore();

  const channelConfig = allChannels.find((c) => c.number === currentChannel);

  // Get the feed URL
  const getFeedUrl = () => {
    if (!channelConfig) return null;

    if (channelConfig.isCustom && channelConfig.customUrl) {
      return channelConfig.customUrl;
    }

    return getSourceUrl(channelConfig.sourceId);
  };

  const feedUrl = getFeedUrl();
  const sourceId = channelConfig?.sourceId || '';

  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    feedUrl ? [sourceId, feedUrl] : null,
    ([srcId, url]: [string, string]) => fetcher(srcId, url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      dedupingInterval: 60 * 1000, // 1 minute
      keepPreviousData: true,
    }
  );

  // Sync with store
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error.message || 'Failed to fetch news');
    } else {
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data?.articles) {
      setArticles(currentChannel, data.articles);
    }
  }, [data, currentChannel, setArticles]);

  return {
    articles: data?.articles || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: () => mutate(),
    cachedAt: data?.cachedAt,
    fromCache: data?.fromCache,
  };
}

// Hook to fetch news for a specific source
export function useNewsBySource(sourceId: string, customUrl?: string) {
  const feedUrl = customUrl || getSourceUrl(sourceId);

  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    feedUrl ? [sourceId, feedUrl] : null,
    ([srcId, url]: [string, string]) => fetcher(srcId, url),
    {
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    articles: data?.articles || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: () => mutate(),
  };
}
