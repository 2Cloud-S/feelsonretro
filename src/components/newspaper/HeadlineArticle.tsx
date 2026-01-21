'use client';

import { Article } from '@/types';
import { useStore } from '@/store';

interface HeadlineArticleProps {
  article: Article;
}

export default function HeadlineArticle({ article }: HeadlineArticleProps) {
  const { selectArticle } = useStore();

  const handleClick = () => {
    selectArticle(article);
  };

  return (
    <article
      className="cursor-pointer group"
      onClick={handleClick}
    >
      {/* Image */}
      {article.image && (
        <div className="w-full h-64 md:h-80 mb-4 overflow-hidden">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            loading="lazy"
          />
        </div>
      )}

      {/* Headline */}
      <h2 className="headline-article text-3xl md:text-4xl font-bold leading-tight mb-4 group-hover:underline">
        {article.title}
      </h2>

      {/* Byline */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="font-semibold uppercase">{article.sourceName}</span>
        <span>-</span>
        <span>
          {new Date(article.pubDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Lead paragraph */}
      <p className="article-text drop-cap text-lg leading-relaxed">
        {article.description}
      </p>

      {/* Continue reading indicator */}
      <p className="text-sm text-gray-500 mt-4 italic">
        Click to continue reading...
      </p>
    </article>
  );
}
