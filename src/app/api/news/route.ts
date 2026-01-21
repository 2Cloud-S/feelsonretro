import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { NEWS_SOURCES, getSourceById } from '@/lib/news/sources';
import { Article } from '@/types';

// Extended item type to include custom fields
interface ExtendedItem {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  mediaContent?: { $?: { url?: string } }[];
  mediaThumbnail?: { $?: { url?: string } }[];
  enclosure?: { url?: string; type?: string };
}

// RSS Parser instance
const parser = new Parser<Record<string, unknown>, ExtendedItem>({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['enclosure', 'enclosure'],
    ],
  },
});

// Simple in-memory cache for development
const cache: Map<string, { data: Article[]; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Generate a unique ID for an article using a simple hash
function generateArticleId(link: string, index: number): string {
  // Create a simple hash from the link
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    const char = link.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Combine hash with index for uniqueness
  return `${Math.abs(hash).toString(36)}-${index}`;
}

// Extract image from various RSS formats
function extractImage(item: ExtendedItem): string | undefined {
  // Try media:content
  if (item.mediaContent?.[0]?.$?.url) {
    return item.mediaContent[0].$.url;
  }

  // Try media:thumbnail
  if (item.mediaThumbnail?.[0]?.$?.url) {
    return item.mediaThumbnail[0].$.url;
  }

  // Try enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }

  // Try to find image in description
  if (item.content || item.contentSnippet) {
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

// Strip HTML tags from text
function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Decode Google News redirect URLs
function decodeGoogleNewsUrl(url: string): string {
  if (!url.includes('news.google.com')) {
    return url;
  }

  // Google News URLs redirect to the actual article
  // For now, we'll keep the Google News URL and let the browser handle the redirect
  return url;
}

// Parse RSS feed and return articles
async function parseRSSFeed(
  sourceId: string,
  url: string
): Promise<Article[]> {
  try {
    const source = getSourceById(sourceId);
    const feed = await parser.parseURL(url);

    return feed.items.slice(0, 20).map((item, index) => ({
      id: generateArticleId(item.link || item.guid || '', index),
      title: item.title || 'Untitled',
      description: stripHtml(item.contentSnippet || item.content || item.summary || ''),
      link: item.link || '',
      originalLink: decodeGoogleNewsUrl(item.link || ''),
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: sourceId,
      sourceName: source?.shortName || sourceId,
      image: extractImage(item),
      category: source?.category,
    }));
  } catch (error) {
    console.error(`Error parsing RSS feed for ${sourceId}:`, error);
    throw error;
  }
}

// GET /api/news - Fetch news from all sources
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sources = searchParams.get('sources')?.split(',') || NEWS_SOURCES.map(s => s.id);
  const refresh = searchParams.get('refresh') === 'true';

  try {
    const allArticles: Article[] = [];

    for (const sourceId of sources) {
      // Check cache first
      const cached = cache.get(sourceId);
      if (!refresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
        allArticles.push(...cached.data);
        continue;
      }

      const source = getSourceById(sourceId);
      if (!source) continue;

      try {
        const articles = await parseRSSFeed(sourceId, source.url);
        cache.set(sourceId, { data: articles, timestamp: Date.now() });
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to fetch ${sourceId}:`, error);
        // Continue with other sources even if one fails
      }
    }

    // Sort by date (newest first)
    allArticles.sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({
      articles: allArticles,
      sources: sources,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
