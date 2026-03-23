export async function fetchNews(keywords = []) {
  const signals = []

  const feeds = [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://www.wired.com/feed/rss',
  ]

  for (const feed of feeds) {
    try {
      const res = await fetch(feed, {
        headers: { 'User-Agent': 'dispatch-agent/1.0' }
      })
      const text = await res.text()

      const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

      for (const item of items.slice(0, 5)) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          item.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] ||
          item.match(/<guid>(.*?)<\/guid>/)?.[1] || ''
        const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
          item.match(/<description>(.*?)<\/description>/)?.[1] || ''

        if (!title) continue

        signals.push({
          source: 'newsapi',
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, ''),
          url: link,
          summary: desc.replace(/<[^>]+>/g, '').slice(0, 200),
        })
      }
    } catch (err) {
      console.error(`[NewsAgent] Error fetching ${feed}:`, err.message)
    }
  }

  return signals
}