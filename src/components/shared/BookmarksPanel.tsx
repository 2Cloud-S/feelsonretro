'use client';

import { useState } from 'react';
import { useStore, useBookmarks, useSettings } from '@/store';

export default function BookmarksPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const bookmarks = useBookmarks();
  const settings = useSettings();
  const { selectArticle, removeBookmark } = useStore();
  const isNewspaperMode = settings.viewMode === 'newspaper';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Bookmark Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all ${
          isNewspaperMode
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-green-600 text-white hover:bg-green-500'
        }`}
        title="Saved Articles"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarks.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {bookmarks.length}
          </span>
        )}
      </button>

      {/* Bookmarks Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Panel */}
          <div
            className={`relative w-full max-w-md h-full overflow-y-auto ${
              isNewspaperMode
                ? 'bg-amber-50 border-l-2 border-black'
                : 'bg-gray-900 border-l border-gray-700'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 p-4 border-b ${
                isNewspaperMode
                  ? 'bg-amber-50 border-black'
                  : 'bg-gray-900 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-xl font-bold ${
                    isNewspaperMode ? 'text-black' : 'text-white'
                  }`}
                >
                  Saved Articles ({bookmarks.length})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded ${
                    isNewspaperMode ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bookmarks List */}
            <div className="p-4">
              {bookmarks.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    isNewspaperMode ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No saved articles yet</p>
                  <p className="text-sm mt-1">
                    Click the bookmark icon on any article to save it for later
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((article) => (
                    <div
                      key={article.id}
                      className={`p-3 rounded-lg ${
                        isNewspaperMode
                          ? 'bg-white border border-gray-300 hover:border-black'
                          : 'bg-gray-800 hover:bg-gray-750'
                      }`}
                    >
                      <button
                        onClick={() => {
                          selectArticle(article);
                          setIsOpen(false);
                        }}
                        className="w-full text-left"
                      >
                        <h3
                          className={`font-medium line-clamp-2 ${
                            isNewspaperMode
                              ? 'text-black hover:text-gray-700'
                              : 'text-white hover:text-green-400'
                          }`}
                        >
                          {article.title}
                        </h3>
                        <div
                          className={`flex items-center gap-2 mt-2 text-xs ${
                            isNewspaperMode ? 'text-gray-600' : 'text-gray-500'
                          }`}
                        >
                          <span className={isNewspaperMode ? '' : 'text-green-500'}>
                            {article.sourceName}
                          </span>
                          <span>•</span>
                          <span>Saved {formatDate(article.bookmarkedAt)}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => removeBookmark(article.id)}
                        className={`mt-2 text-xs ${
                          isNewspaperMode
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-red-400 hover:text-red-300'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
