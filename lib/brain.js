import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function scoreAndAct(signals, userProfile) {
  if (!signals.length) return []

  const processed = []

  for (const signal of signals) {
    const prompt = `
User goals: ${userProfile.goals.join(', ')}
User keywords: ${userProfile.keywords.join(', ')}

Signal source: ${signal.source}
Signal title: ${signal.title}

Score relevance (high/medium/low), pick action (drafted post/drafted application/flagged for review/bookmarked/skipped), write a short draft if high, set needs_review if needs approval.

Reply ONLY in JSON:
{"score":"high|medium|low","action_taken":"string","draft":"string or null","needs_review":true|false}
    `.trim()

    try {
      const res = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      })

      const raw = res.choices[0].message.content.trim()
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      console.log('[Brain]', parsed.score, '-', signal.title?.slice(0, 50))

      processed.push({ ...signal, ...parsed })
      await new Promise(r => setTimeout(r, 500))
    } catch (err) {
      console.error('[Brain] Failed to score signal:', signal.title, err.message)
      processed.push({
        ...signal,
        score: 'low',
        action_taken: 'skipped',
        draft: null,
        needs_review: false,
      })
    }
  }

  return processed
}