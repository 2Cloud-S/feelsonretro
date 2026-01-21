'use client';

import useSWR from 'swr';
import { useStore, useCurrentChannel, useAllChannels } from '@/store';
import { Article } from '@/types';
import { useEffect } from 'react';

interface NewsResponse {
  articles: Article[];
  source: string;
  cachedAt: string;
  fromCache?: boolean;
  error?: string;
}

const fetcher = async (url: string): Promise<NewsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
};

export function useNews() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const { setArticles, setLoading, setError } = useStore();

  const channelConfig = allChannels.find((c) => c.number === currentChannel);

  // Build the URL based on channel type
  const getUrl = () => {
    if (!channelConfig) return null;

    if (channelConfig.isCustom && channelConfig.customUrl) {
      return `/api/news/${channelConfig.sourceId}?url=${encodeURIComponent(channelConfig.customUrl)}`;
    }

    return `/api/news/${channelConfig.sourceId}`;
  };

  const url = getUrl();

  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    url,
    fetcher,
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
  const url = customUrl
    ? `/api/news/${sourceId}?url=${encodeURIComponent(customUrl)}`
    : `/api/news/${sourceId}`;

  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    url,
    fetcher,
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
