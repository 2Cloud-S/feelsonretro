'use client';

import useSWR from 'swr';

interface ArticleContent {
  title: string;
  content: string;
  textContent: string;
  excerpt: string;
  author?: string;
  siteName?: string;
  image?: string;
}

// Use a CORS proxy to fetch the article HTML, then extract content client-side
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Simple HTML to text content extraction
function extractArticleContent(html: string, url: string): ArticleContent {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script, style, nav, footer, header, aside elements
  const removeSelectors = ['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'noscript', '.ad', '.advertisement', '.social-share', '.comments'];
  removeSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Try to find the main article content using common selectors
  const articleSelectors = [
    'article',
    '[role="main"]',
    'main',
    '.article-content',
    '.article-body',
    '.post-content',
    '.entry-content',
    '.content-body',
    '.story-body',
    '#article-body',
    '.article__body',
  ];

  let articleElement: Element | null = null;
  for (const selector of articleSelectors) {
    articleElement = doc.querySelector(selector);
    if (articleElement) break;
  }

  // Fallback to body if no article container found
  if (!articleElement) {
    articleElement = doc.body;
  }

  // Get title from various sources
  const title =
    doc.querySelector('h1')?.textContent?.trim() ||
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('title')?.textContent?.trim() ||
    '';

  // Get author
  const author =
    doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
    doc.querySelector('[rel="author"]')?.textContent?.trim() ||
    doc.querySelector('.author')?.textContent?.trim() ||
    undefined;

  // Get site name
  const siteName =
    doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
    new URL(url).hostname.replace('www.', '');

  // Get image
  const image =
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc.querySelector('article img')?.getAttribute('src') ||
    undefined;

  // Extract paragraphs from article element
  const paragraphs = articleElement.querySelectorAll('p');
  const contentParagraphs: string[] = [];

  paragraphs.forEach(p => {
    const text = p.textContent?.trim();
    // Filter out short paragraphs (likely captions or noise)
    if (text && text.length > 50) {
      contentParagraphs.push(text);
    }
  });

  // Build HTML content with paragraphs
  const content = contentParagraphs.map(p => `<p>${p}</p>`).join('\n');
  const textContent = contentParagraphs.join('\n\n');
  const excerpt = contentParagraphs[0]?.slice(0, 300) || '';

  return {
    title,
    content,
    textContent,
    excerpt,
    author,
    siteName,
    image,
  };
}

// Fetcher function
const fetcher = async (url: string): Promise<ArticleContent> => {
  // Use CORS proxy
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }

  const html = await response.text();
  return extractArticleContent(html, url);
};

export function useArticleContent(url: string | null) {
  const { data, error, isLoading } = useSWR<ArticleContent>(
    url ? ['article', url] : null,
    ([, articleUrl]: [string, string]) => fetcher(articleUrl),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000, // Cache for 1 hour
    }
  );

  return {
    content: data,
    isLoading,
    isError: !!error,
    error: error?.message,
  };
}
