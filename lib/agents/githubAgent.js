export async function fetchGithub(keywords = []) {
  const signals = []

  for (const keyword of keywords.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=desc&per_page=5`,
        { headers: { 'User-Agent': 'dispatch-agent/1.0' } }
      )
      const data = await res.json()
      const repos = data?.items || []

      for (const repo of repos) {
        signals.push({
          source: 'github',
          title: `${repo.full_name} — ${repo.stargazers_count} stars`,
          url: repo.html_url,
          summary: repo.description || repo.full_name,
        })
      }
    } catch (err) {
      console.error(`[GithubAgent] Error for ${keyword}:`, err.message)
    }
  }

  return signals
}