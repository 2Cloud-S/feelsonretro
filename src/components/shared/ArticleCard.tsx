'use client';

import { Article } from '@/types';
import { useStore } from '@/store';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { selectArticle } = useStore();

  const handleClick = () => {
    selectArticle(article);
  };

  // Format the date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left p-3 md:p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded transition-colors group"
      >
        <h3 className="text-base md:text-lg font-medium text-gray-100 group-hover:text-green-400 line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <span>{article.sourceName}</span>
          <span>-</span>
          <span>{formatDate(article.pubDate)}</span>
        </div>
      </button>
    );
  }

  if (variant === 'featured') {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left p-4 md:p-5 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg transition-colors group"
      >
        {article.image && (
          <div className="w-full h-48 md:h-56 mb-4 overflow-hidden rounded bg-gray-700">
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-green-400 mb-3">
          {article.title}
        </h2>
        <p className="text-base text-gray-400 line-clamp-3 mb-3">
          {article.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-green-500 font-medium">{article.sourceName}</span>
          <span>-</span>
          <span>{formatDate(article.pubDate)}</span>
        </div>
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 md:p-5 bg-gray-800/50 hover:bg-gray-700/50 rounded transition-colors group"
    >
      <h3 className="text-lg md:text-xl font-medium text-gray-100 group-hover:text-green-400 mb-2 line-clamp-2">
        {article.title}
      </h3>
      <p className="text-base text-gray-400 line-clamp-2 mb-3">
        {article.description}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-green-500">{article.sourceName}</span>
        <span>-</span>
        <span>{formatDate(article.pubDate)}</span>
      </div>
    </button>
  );
}
