export async function fetchProductHunt(keywords = []) {
  const signals = []

  try {
    const res = await fetch('https://api.hnpwa.com/v0/newest/1.json')
    const posts = await res.json()

    for (const post of posts.slice(0, 10)) {
      const isRelevant = keywords.length === 0 || keywords.some(k =>
        post.title?.toLowerCase().includes(k.toLowerCase())
      )
      if (isRelevant) {
        signals.push({
          source: 'hackernews',
          title: post.title,
          url: post.url || `https://news.ycombinator.com/item?id=${post.id}`,
          summary: `${post.points} points · ${post.comments_count} comments`,
        })
      }
    }
  } catch (err) {
    console.error('[ProductHuntAgent] Error:', err.message)
  }

  return signals
}