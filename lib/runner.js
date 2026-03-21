import supabase from './supabase.js'
import { scoreAndAct } from './brain.js'
import { fetchNews } from './agents/newsAgent.js'
import { fetchReddit } from './agents/redditAgent.js'
import { fetchGithub } from './agents/githubAgent.js'
import { fetchJobs } from './agents/jobsAgent.js'
import { fetchHackerNews } from './agents/hackerNewsAgent.js'
import { fetchProductHunt } from './agents/productHuntAgent.js'
import { fetchIndieHackers } from './agents/indieHackersAgent.js'
import { fetchCrypto } from './agents/cryptoAgent.js'
import { fetchImmunefi } from './agents/immunefiAgent.js'

export async function runDispatch(userId) {
  console.log(`[Dispatch] Starting run for user: ${userId}`)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('[Dispatch] No profile found for user:', userId)
    return
  }

  const [news, reddit, github, jobs, hn, ph, ih, crypto, bounty] = await Promise.all([
    fetchNews(profile.keywords),
    fetchReddit(profile.keywords, profile.custom_subreddits || []),
    fetchGithub(profile.keywords),
    fetchJobs(profile.keywords),
    fetchHackerNews(profile.keywords),
    fetchProductHunt(profile.keywords),
    fetchIndieHackers(profile.keywords),
    fetchCrypto(profile.keywords),
    fetchImmunefi(profile.keywords),
  ])

  const allSignals = [...news, ...reddit, ...github, ...jobs, ...hn, ...ph, ...ih, ...crypto, ...bounty].slice(0, 15)
  console.log(`[Dispatch] ${allSignals.length} raw signals gathered.`)

  if (!allSignals.length) return

  const processed = await scoreAndAct(allSignals, profile)

  const { error: insertError } = await supabase
    .from('signals')
    .insert(processed.map(s => ({ ...s, user_id: userId })))

  if (insertError) console.error('[Dispatch] DB insert error:', insertError)

  const actions = processed.filter(s => s.action_taken !== 'skipped').length
  const needsReview = processed.filter(s => s.needs_review).length

  await supabase.from('briefings').insert({
    user_id: userId,
    signal_count: processed.length,
    action_count: actions,
    review_count: needsReview,
  })

  console.log(`[Dispatch] Done. ${processed.length} signals, ${actions} actions, ${needsReview} need review.`)
  return processed
}