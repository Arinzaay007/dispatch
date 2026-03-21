export async function fetchIndieHackers(keywords = []) {
  const signals = []

  try {
    const res = await fetch('https://api.hnpwa.com/v0/show/1.json')
    const posts = await res.json()

    for (const post of posts.slice(0, 10)) {
      const isRelevant = keywords.length === 0 || keywords.some(k =>
        post.title?.toLowerCase().includes(k.toLowerCase())
      )
      if (isRelevant) {
        signals.push({
          source: 'show_hn',
          title: post.title,
          url: post.url || `https://news.ycombinator.com/item?id=${post.id}`,
          summary: `${post.points} points · ${post.comments_count} comments`,
        })
      }
    }
  } catch (err) {
    console.error('[IndieHackersAgent] Error:', err.message)
  }

  return signals
}