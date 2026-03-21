export async function fetchNews(keywords = []) {
  const query = keywords.slice(0, 3).join(' OR ')
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data.articles) return []

    return data.articles.map(a => ({
      source: 'newsapi',
      title: a.title,
      url: a.url,
      summary: a.description || a.title,
    }))
  } catch (err) {
    console.error('[NewsAgent] Error:', err.message)
    return []
  }
}