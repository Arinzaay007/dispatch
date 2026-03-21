const SUBREDDITS = ['MachineLearning', 'webdev', 'netsec', 'solidity', 'cscareerquestions', 'bugbounty', 'ethdev', 'javascript']

export async function fetchReddit(keywords = []) {
  const signals = []

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`,
        { headers: { 'User-Agent': 'dispatch-agent/1.0' } }
      )
      const data = await res.json()
      const posts = data?.data?.children || []

      for (const post of posts) {
        const { title, url, selftext } = post.data
        signals.push({
          source: 'reddit',
          title,
          url,
          summary: selftext?.slice(0, 200) || title,
        })
      }
    } catch (err) {
      console.error(`[RedditAgent] Error on r/${sub}:`, err.message)
    }
  }

  return signals
}