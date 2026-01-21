'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { useSettings } from '@/store';
import { useArticleContent } from '@/hooks/useArticleContent';

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleReader({ article, onClose }: ArticleReaderProps) {
  const settings = useSettings();
  const isNewspaperMode = settings.viewMode === 'newspaper';
  const [showFullArticle, setShowFullArticle] = useState(false);

  // Fetch full article content when user requests it
  const { content, isLoading, isError } = useArticleContent(
    showFullArticle ? (article.originalLink || article.link) : null
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleReadFull = () => {
    if (!showFullArticle) {
      setShowFullArticle(true);
    } else {
      window.open(article.originalLink || article.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenExternal = () => {
    window.open(article.originalLink || article.link, '_blank', 'noopener,noreferrer');
  };

  // Render article content (either preview or full)
  const renderContent = () => {
    if (showFullArticle) {
      if (isLoading) {
        return (
          <div className={`${isNewspaperMode ? 'text-gray-600' : 'text-gray-400'} text-center py-8`}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent mb-4"></div>
            <p>Loading full article...</p>
          </div>
        );
      }

      if (isError || !content) {
        return (
          <div className={`${isNewspaperMode ? 'text-gray-800' : 'text-gray-300'} text-lg leading-relaxed mb-8`}>
            <p className="drop-cap">{article.description}</p>
            <div className={`mt-6 p-4 rounded ${isNewspaperMode ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700'}`}>
              <p className={`text-sm ${isNewspaperMode ? 'text-yellow-800' : 'text-yellow-400'}`}>
                Unable to load full article. The website may be blocking direct access.
              </p>
            </div>
          </div>
        );
      }

      // Show full article content
      const paragraphs = content.textContent.split('\n\n').filter(p => p.trim());

      return (
        <div className={`${isNewspaperMode ? 'text-gray-800' : 'text-gray-300'} text-lg leading-relaxed mb-8 font-serif`}>
          {content.author && (
            <p className={`text-sm ${isNewspaperMode ? 'text-gray-600' : 'text-gray-500'} mb-4 italic`}>
              By {content.author}
            </p>
          )}
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'drop-cap mb-4' : 'mb-4'}>
              {paragraph}
            </p>
          ))}
          {paragraphs.length === 0 && (
            <p className="drop-cap">{article.description}</p>
          )}
        </div>
      );
    }

    // Show preview only
    return (
      <div className={`${isNewspaperMode ? 'text-gray-800' : 'text-gray-300'} text-lg leading-relaxed mb-8 ${isNewspaperMode ? 'font-serif' : ''}`}>
        <p className="drop-cap">{article.description}</p>
      </div>
    );
  };

  // Newspaper mode styling
  if (isNewspaperMode) {
    return (
      <div className="h-full overflow-y-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm uppercase tracking-wider">Back to Front Page</span>
          </button>

          <span className="text-xs text-gray-500 uppercase tracking-wider">{article.sourceName}</span>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto">
          {/* Category */}
          {article.category && (
            <div className="section-header text-xs mb-4">
              {article.category}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight font-serif">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-300">
            <span className="font-semibold">{article.sourceName}</span>
            <span>{formatDate(article.pubDate)}</span>
          </div>

          {/* Image */}
          {(article.image || (showFullArticle && content?.image)) && (
            <div className="w-full mb-6 overflow-hidden">
              <img
                src={content?.image || article.image}
                alt=""
                className="w-full h-auto object-cover"
              />
              <p className="text-xs text-gray-500 mt-2 italic">Image source: {article.sourceName}</p>
            </div>
          )}

          {/* Content */}
          {renderContent()}

          {/* Action buttons */}
          <div className="text-center py-8 border-t-2 border-black">
            {!showFullArticle ? (
              <>
                <p className="text-gray-600 mb-4">
                  View the complete article
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleReadFull}
                    className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Load Full Article
                  </button>
                  <button
                    onClick={handleOpenExternal}
                    className="px-6 py-3 border-2 border-black text-black font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                  >
                    Open on Source Site ↗
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  {isError ? 'Read the original article' : 'View on the source website'}
                </p>
                <button
                  onClick={handleOpenExternal}
                  className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Open Original Article ↗
                </button>
              </>
            )}
          </div>
        </article>
      </div>
    );
  }

  // TV mode styling (default)
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to channel</span>
        </button>

        <span className="text-xs text-gray-500">{article.sourceName}</span>
      </div>

      {/* Article Content */}
      <article className="max-w-2xl mx-auto">
        {/* Image */}
        {(article.image || (showFullArticle && content?.image)) && (
          <div className="w-full h-64 mb-6 overflow-hidden rounded-lg bg-gray-800">
            <img
              src={content?.image || article.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-700">
          <span style={{ color: '#22c55e' }}>{article.sourceName}</span>
          <span>{formatDate(article.pubDate)}</span>
          {article.category && (
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs uppercase">
              {article.category}
            </span>
          )}
        </div>

        {/* Content */}
        {renderContent()}

        {/* Action buttons */}
        <div className="text-center py-8 border-t border-gray-700">
          {!showFullArticle ? (
            <>
              <p className="text-gray-500 mb-4">
                View the complete article
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReadFull}
                  className="retro-button"
                >
                  Load Full Article
                </button>
                <button
                  onClick={handleOpenExternal}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                >
                  Open on Source Site ↗
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-4">
                {isError ? 'Read the original article' : 'View on the source website'}
              </p>
              <button
                onClick={handleOpenExternal}
                className="retro-button"
              >
                Open Original Article ↗
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
