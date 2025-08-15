const NEWS_API_KEY = process.env.REACT_APP_NEWSAPI_KEY;
const RSS2JSON_URL = process.env.REACT_APP_RSS2JSON_API_URL || 'https://api.rss2json.com/v1/api.json';
const DEFAULT_RSS_FEEDS = [
  'https://www.motorsport.com/rss/f1/news/',
  'https://www.racefans.net/category/f1/feed/'
];

/**
 * Try fetching F1 news using NewsAPI.org if key provided.
 */
async function fetchWithNewsAPI() {
  const url = `https://newsapi.org/v2/everything?q=Formula%201%20OR%20F1&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('NewsAPI HTTP error');
  const data = await res.json();
  if (data?.status !== 'ok') throw new Error('NewsAPI status not ok');
  return (data.articles || []).map((a) => ({
    title: a.title,
    url: a.url,
    publishedAt: a.publishedAt,
    source: a.source?.name || 'NewsAPI',
    image: a.urlToImage || null,
    description: a.description || ''
  }));
}

/**
 * Fallback using rss2json for public RSS feeds (subject to rate limits).
 */
async function fetchWithRSS() {
  const all = [];
  for (const feed of DEFAULT_RSS_FEEDS) {
    const url = `${RSS2JSON_URL}?rss_url=${encodeURIComponent(feed)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const items = (data?.items || []).map((i) => ({
        title: i.title,
        url: i.link,
        publishedAt: i.pubDate,
        source: data?.feed?.title || 'RSS',
        image: i.enclosure?.link || null,
        description: i.description || ''
      }));
      all.push(...items);
    } catch {
      // ignore
    }
  }
  // sort by date desc
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return all.slice(0, 12);
}

// PUBLIC_INTERFACE
export async function fetchF1News() {
  /** Fetches a list of news items about Formula 1 using either NewsAPI (if configured) or RSS fallback. */
  if (NEWS_API_KEY) {
    try {
      return await fetchWithNewsAPI();
    } catch {
      // Fallback to RSS on failure
    }
  }
  return await fetchWithRSS();
}
