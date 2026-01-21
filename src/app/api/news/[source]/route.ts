import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { getSourceById, getSourceUrl } from '@/lib/news/sources';
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

// Simple in-memory cache
const cache: Map<string, { data: Article[]; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Generate a unique ID for an article using a simple hash
function generateArticleId(link: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    const char = link.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${Math.abs(hash).toString(36)}-${index}`;
}

function extractImage(item: ExtendedItem): string | undefined {
  if (item.mediaContent?.[0]?.$?.url) {
    return item.mediaContent[0].$.url;
  }

  if (item.mediaThumbnail?.[0]?.$?.url) {
    return item.mediaThumbnail[0].$.url;
  }

  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }

  if (item.content || item.contentSnippet) {
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ source: string }> }
) {
  const { source: sourceId } = await params;
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get('refresh') === 'true';
  const customUrl = searchParams.get('url');

  // Check cache first (unless refresh is requested)
  const cached = cache.get(sourceId);
  if (!refresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({
      articles: cached.data,
      source: sourceId,
      cachedAt: new Date(cached.timestamp).toISOString(),
      fromCache: true,
    });
  }

  // Get the RSS URL
  let url: string | undefined;

  if (sourceId.startsWith('custom-') && customUrl) {
    // Custom RSS feed
    url = customUrl;
  } else {
    url = getSourceUrl(sourceId);
  }

  if (!url) {
    return NextResponse.json(
      { error: 'Source not found' },
      { status: 404 }
    );
  }

  try {
    const source = getSourceById(sourceId);
    const feed = await parser.parseURL(url);

    const articles: Article[] = feed.items.slice(0, 20).map((item, index) => ({
      id: generateArticleId(item.link || item.guid || '', index),
      title: item.title || 'Untitled',
      description: stripHtml(item.contentSnippet || item.content || item.summary || ''),
      link: item.link || '',
      originalLink: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: sourceId,
      sourceName: source?.shortName || sourceId.replace('custom-', 'CH'),
      image: extractImage(item),
      category: source?.category || 'custom',
    }));

    // Update cache
    cache.set(sourceId, { data: articles, timestamp: Date.now() });

    return NextResponse.json({
      articles,
      source: sourceId,
      cachedAt: new Date().toISOString(),
      fromCache: false,
    });
  } catch (error) {
    console.error(`Error fetching source ${sourceId}:`, error);

    // Return cached data if available, even if stale
    if (cached) {
      return NextResponse.json({
        articles: cached.data,
        source: sourceId,
        cachedAt: new Date(cached.timestamp).toISOString(),
        fromCache: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch news from source' },
      { status: 500 }
    );
  }
}
