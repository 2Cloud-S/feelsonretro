'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import { useStore, useCurrentChannel, useAllChannels, useSelectedArticle } from '@/store';
import Masthead from './Masthead';
import HeadlineArticle from './HeadlineArticle';
import ArticleColumn from './ArticleColumn';
import ArticleReader from '../shared/ArticleReader';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';

export default function NewspaperLayout() {
  const currentChannel = useCurrentChannel();
  const allChannels = useAllChannels();
  const selectedArticle = useSelectedArticle();
  const { selectArticle, setViewMode } = useStore();
  const { articles, isLoading, isError, error, refresh } = useNews();

  const channelConfig = allChannels.find((c) => c.number === currentChannel);

  // Show article reader modal if an article is selected
  if (selectedArticle) {
    return (
      <div className="newspaper-layout paper-texture min-h-screen">
        <div className="max-w-6xl mx-auto">
          <ArticleReader
            article={selectedArticle}
            onClose={() => selectArticle(null)}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && articles.length === 0) {
    return (
      <div className="newspaper-layout paper-texture min-h-screen flex items-center justify-center">
        <LoadingState message="Printing today's edition..." />
      </div>
    );
  }

  // Error state
  if (isError && articles.length === 0) {
    return (
      <div className="newspaper-layout paper-texture min-h-screen flex items-center justify-center">
        <ErrorState message={error || 'Press stopped'} onRetry={refresh} />
      </div>
    );
  }

  // Split articles for layout
  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const tertiaryArticles = articles.slice(4, 8);
  const sidebarArticles = articles.slice(8, 12);

  return (
    <div className="newspaper-layout paper-texture min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Masthead */}
        <Masthead />

        {/* Channel/Section Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-4 py-4 border-b-2 border-black mb-6">
          {allChannels.slice(0, 9).map((channel) => (
            <button
              key={channel.number}
              onClick={() => useStore.getState().setChannel(channel.number)}
              className={`
                text-sm uppercase tracking-wider px-3 py-1
                transition-colors
                ${
                  currentChannel === channel.number
                    ? 'font-bold border-b-2 border-black'
                    : 'text-gray-600 hover:text-black'
                }
              `}
            >
              {channel.shortName}
            </button>
          ))}
          <button
            onClick={() => setViewMode('tv')}
            className="text-sm uppercase tracking-wider px-3 py-1 text-gray-500 hover:text-black ml-4"
          >
            TV Mode
          </button>
        </nav>

        {/* Section Header */}
        <div className="section-header mb-4">
          {channelConfig?.category || 'Top Stories'}
        </div>

        {/* Main Content Grid */}
        {articles.length > 0 && (
          <div className="newspaper-grid">
            {/* Featured Article (spans 3 columns) */}
            {featuredArticle && (
              <div className="headline-article">
                <HeadlineArticle article={featuredArticle} />
              </div>
            )}

            {/* Sidebar (1 column) */}
            <div className="space-y-4">
              <div className="section-header text-xs">More Headlines</div>
              {sidebarArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => selectArticle(article)}
                  className="block w-full text-left group"
                >
                  <h4 className="text-sm font-semibold group-hover:underline line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>

            {/* Secondary Articles Row */}
            {secondaryArticles.map((article, idx) => (
              <ArticleColumn
                key={article.id}
                article={article}
                showDivider={idx < secondaryArticles.length - 1}
              />
            ))}

            {/* Tertiary Articles */}
            {tertiaryArticles.map((article, idx) => (
              <ArticleColumn
                key={article.id}
                article={article}
                compact
                showDivider={idx < tertiaryArticles.length - 1}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-4 border-t-2 border-black text-center text-xs text-gray-600">
          <p>
            All articles sourced from their respective publishers.
            Click any article to read the full story.
          </p>
          <p className="mt-2">
            <button
              onClick={refresh}
              className="underline hover:text-black"
            >
              Refresh Edition
            </button>
            {' '} - {' '}
            <button
              onClick={() => setViewMode('tv')}
              className="underline hover:text-black"
            >
              Switch to TV Mode
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}
