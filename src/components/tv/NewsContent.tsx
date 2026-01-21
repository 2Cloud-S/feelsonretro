'use client';

import { useNews } from '@/hooks/useNews';
import { useCurrentChannel, useAllChannels, useSelectedArticle, useStore } from '@/store';
import ArticleCard from '../shared/ArticleCard';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import ArticleReader from '../shared/ArticleReader';

export default function NewsContent() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const selectedArticle = useSelectedArticle();
  const { selectArticle } = useStore();
  const { articles, isLoading, isError, error, refresh } = useNews();

  const channelConfig = allChannels.find((c) => c.number === currentChannel);

  // Show article reader if an article is selected
  if (selectedArticle) {
    return (
      <ArticleReader
        article={selectedArticle}
        onClose={() => selectArticle(null)}
      />
    );
  }

  // Loading state
  if (isLoading && articles.length === 0) {
    return <LoadingState message={`Tuning to ${channelConfig?.shortName || 'channel'}...`} />;
  }

  // Error state
  if (isError && articles.length === 0) {
    return (
      <ErrorState
        message={error || 'Failed to receive signal'}
        onRetry={refresh}
      />
    );
  }

  // No articles
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
        <p className="text-gray-500 text-lg">No broadcasts on this channel</p>
        <button onClick={refresh} className="retro-button mt-4 text-xs">
          Refresh
        </button>
      </div>
    );
  }

  // Featured article (first one)
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="h-full overflow-y-auto pr-2">
      {/* Channel Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4 pb-2 border-b border-gray-700">
        <div>
          <h2
            className="text-lg md:text-2xl font-bold"
            style={{ color: channelConfig?.color || '#fff' }}
          >
            {channelConfig?.name || 'News'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {articles.length} stories
          </p>
        </div>
        <button
          onClick={refresh}
          className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors px-2 py-1"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Featured Article */}
      <div className="mb-4 md:mb-6">
        <ArticleCard article={featuredArticle} variant="featured" />
      </div>

      {/* Article Grid - 3 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {remainingArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>

      {/* Loading indicator for background refresh */}
      {isLoading && articles.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-gray-800 px-3 py-2 rounded-lg text-xs text-gray-400">
          Updating...
        </div>
      )}
    </div>
  );
}
