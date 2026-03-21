export async function fetchIndieHackers(keywords = []) {
  const signals = []

  try {
    const res = await fetch('https://www.indiehackers.com/api/legacy/get-posts?limit=20')
    const data = await res.json()
    const posts = data?.items || []

    for (const post of posts) {
      const isRelevant = keywords.length === 0 || keywords.some(k =>
        post.title?.toLowerCase().includes(k.toLowerCase())
      )

      if (isRelevant) {
        signals.push({
          source: 'indiehackers',
          title: post.title,
          url: `https://www.indiehackers.com${post.url}`,
          summary: post.content?.slice(0, 200) || post.title,
        })
      }
    }
  } catch (err) {
    console.error('[IndieHackersAgent] Error:', err.message)
  }

  return signals
}