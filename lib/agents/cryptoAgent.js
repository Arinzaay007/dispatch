export async function fetchCrypto(keywords = []) {
  const signals = []

  const feeds = [
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://decrypt.co/feed',
    'https://cointelegraph.com/rss',
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
          item.match(/<link\/>(.*?)<\/link>/)?.[1] || ''
        const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
          item.match(/<description>(.*?)<\/description>/)?.[1] || ''

        if (!title) continue

        const isRelevant = keywords.length === 0 || keywords.some(k =>
          title.toLowerCase().includes(k.toLowerCase()) ||
          desc.toLowerCase().includes(k.toLowerCase())
        )

        if (isRelevant) {
          signals.push({
            source: 'crypto',
            title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
            url: link,
            summary: desc.replace(/<[^>]+>/g, '').slice(0, 200),
          })
        }
      }
    } catch (err) {
      console.error(`[CryptoAgent] Error fetching ${feed}:`, err.message)
    }
  }

  return signals
}