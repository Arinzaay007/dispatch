export async function fetchProductHunt(keywords = []) {
  const signals = []

  try {
    const res = await fetch('https://www.producthunt.com/frontend/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          posts(first: 20, order: VOTES) {
            edges {
              node {
                name
                tagline
                url
                votesCount
                topics {
                  edges {
                    node { name }
                  }
                }
              }
            }
          }
        }`
      })
    })

    const data = await res.json()
    const posts = data?.data?.posts?.edges || []

    for (const { node } of posts) {
      const isRelevant = keywords.length === 0 || keywords.some(k =>
        node.name?.toLowerCase().includes(k.toLowerCase()) ||
        node.tagline?.toLowerCase().includes(k.toLowerCase())
      )

      if (isRelevant) {
        signals.push({
          source: 'producthunt',
          title: `${node.name} — ${node.tagline}`,
          url: node.url,
          summary: `${node.votesCount} votes on Product Hunt`,
        })
      }
    }
  } catch (err) {
    console.error('[ProductHuntAgent] Error:', err.message)
  }

  return signals
}