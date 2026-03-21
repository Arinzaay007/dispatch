export async function fetchJobs(keywords = []) {
  const signals = []

  const searches = [
    'solidity',
    'web3',
    'smart contract',
    'blockchain',
    'javascript',
    'react',
    'node',
    ...keywords.slice(0, 3)
  ]

  for (const query of searches.slice(0, 5)) {
    try {
      const res = await fetch(
        `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=5`
      )
      const data = await res.json()
      const jobs = data?.jobs || []

      for (const job of jobs) {
        signals.push({
          source: 'jobs',
          title: `${job.title} — ${job.company_name}`,
          url: job.url,
          summary: job.description?.slice(0, 200) || job.title,
        })
      }
    } catch (err) {
      console.error('[JobsAgent] Error:', err.message)
    }
  }

  return signals
}