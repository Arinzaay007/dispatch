export async function fetchImmunefi(keywords = []) {
  const signals = []

  const feeds = [
    'https://immunefi.com/rss.xml',
    'https://feeds.feedburner.com/HackerOne',
  ]

  for (const feed of feeds) {
    try {
      const res = await fetch(feed, {
        headers: { 'User-Agent': 'dispatch-agent/1.0' }
      })
      const text = await res.text()

      const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

      for (const item of items.slice(0, 8)) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          item.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
        const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
          item.match(/<description>(.*?)<\/description>/)?.[1] || ''

        if (!title) continue

        signals.push({
          source: 'bugbounty',
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          url: link,
          summary: desc.replace(/<[^>]+>/g, '').slice(0, 200) || title,
        })
      }
    } catch (err) {
      console.error(`[ImmunefiAgent] Error fetching ${feed}:`, err.message)
    }
  }

  return signals
}