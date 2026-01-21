'use client';

import { Article } from '@/types';
import { useStore } from '@/store';

interface ArticleColumnProps {
  article: Article;
  compact?: boolean;
  showDivider?: boolean;
}

export default function ArticleColumn({
  article,
  compact = false,
  showDivider = false,
}: ArticleColumnProps) {
  const { selectArticle } = useStore();

  const handleClick = () => {
    selectArticle(article);
  };

  if (compact) {
    return (
      <article
        className={`cursor-pointer group ${showDivider ? 'column-divider' : ''}`}
        onClick={handleClick}
      >
        <h3 className="text-base font-semibold leading-tight mb-2 group-hover:underline line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-600">
          {article.sourceName} -{' '}
          {new Date(article.pubDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </article>
    );
  }

  return (
    <article
      className={`cursor-pointer group ${showDivider ? 'column-divider' : ''}`}
      onClick={handleClick}
    >
      {/* Optional image */}
      {article.image && (
        <div className="w-full h-32 mb-3 overflow-hidden">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            loading="lazy"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold leading-tight mb-2 group-hover:underline">
        {article.title}
      </h3>

      {/* Source and date */}
      <p className="text-xs text-gray-600 mb-2">
        <span className="font-semibold uppercase">{article.sourceName}</span>
        {' - '}
        {new Date(article.pubDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </p>

      {/* Description */}
      <p className="article-text text-sm line-clamp-4">
        {article.description}
      </p>
    </article>
  );
}
