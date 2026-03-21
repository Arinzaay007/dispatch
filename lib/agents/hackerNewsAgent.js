export async function fetchHackerNews(keywords = []) {
  const signals = []

  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await res.json()
    const top20 = ids.slice(0, 20)

    for (const id of top20) {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      const story = await storyRes.json()

      if (!story || !story.title) continue

      const isRelevant = keywords.length === 0 || keywords.some(k =>
        story.title.toLowerCase().includes(k.toLowerCase())
      )

      if (isRelevant) {
        signals.push({
          source: 'hackernews',
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          summary: `${story.score} points · ${story.descendants || 0} comments`,
        })
      }
    }
  } catch (err) {
    console.error('[HackerNewsAgent] Error:', err.message)
  }

  return signals
}