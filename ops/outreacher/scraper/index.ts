import fetch from 'node-fetch';
import { load } from 'cheerio';
import type { ScrapedSite } from '../types';

export const normalizeUrl = (rawUrl: string): string => {
  let url = rawUrl.trim();

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/^http:\/\//i, 'https://');
  url = url.replace(/\/+$/, '');

  return url;
};

export const scrapeSite = async (url: string): Promise<ScrapedSite> => {
  const normalizedUrl = normalizeUrl(url);

  const res = await fetch(normalizedUrl, { timeout: 15000 as any });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${normalizedUrl}: ${res.status}`);
  }

  const html = await res.text();
  const $ = load(html);

  const title = $('title').first().text() || '';
  const metaDescription =
    $('meta[name="description"]').attr('content') || '';

  const selectors = [
    'h1',
    'h2',
    'h3',
    'header',
    'main',
    'section',
    'footer',
    '.hero',
    '.about',
    '.services',
    '.clients',
  ];

  let chunks: string[] = [];

  selectors.forEach((sel) => {
    $(sel).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text && text.length > 40) {
        chunks.push(text);
      }
    });
  });

  // dedupe text chunks
  chunks = Array.from(new Set(chunks));

  const combined = chunks.join('\n\n').slice(0, 5000);

  // ---- Email scraping ----
  const emailSet = new Set<string>();

  // 1) mailto: links
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const email = href.replace(/^mailto:/i, '').split('?')[0].trim();
    if (email) {
      emailSet.add(email.toLowerCase());
    }
  });

  // 2) regex over raw HTML
  const emailRegex =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

  let match: RegExpExecArray | null;
  while ((match = emailRegex.exec(html)) !== null) {
    const email = match[0].toLowerCase();
    emailSet.add(email);
  }

  // Basic filtering
  const emails = Array.from(emailSet).filter((email) => {
    if (email.includes('noreply') || email.includes('no-reply')) return false;
    if (email.includes('example.com') || email.includes('localhost')) return false;
    return true;
  });

  return {
    url: normalizedUrl,
    title,
    metaDescription,
    content: combined,
    emails,
  };
};


