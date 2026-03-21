import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function scoreAndAct(signals, userProfile) {
  if (!signals.length) return []

  const processed = []

  for (const signal of signals) {
    const prompt = `
You are Dispatch, an AI agent assistant.

User profile:
- Goals: ${userProfile.goals.join(', ')}
- Keywords of interest: ${userProfile.keywords.join(', ')}

Signal:
- Source: ${signal.source}
- Title: ${signal.title}
- Summary: ${signal.summary}

Tasks:
1. Score relevance: "high", "medium", or "low"
2. Decide action: one of "drafted post", "drafted application", "flagged for review", "bookmarked", "skipped"
3. If score is "high" and action is "drafted post" or "drafted application", write the draft (max 150 words)
4. Set needs_review to true if action requires user approval

Respond ONLY with valid JSON, no markdown, no code fences:
{
  "score": "high|medium|low",
  "action_taken": "string",
  "draft": "string or null",
  "needs_review": true|false
}
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