'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const STEPS = ['Welcome', 'Goals', 'Keywords', 'Subreddits', 'Done']

const GOAL_OPTIONS = [
  'Find remote jobs',
  'Grow my audience',
  'Find bug bounties',
  'Stay up to date on AI',
  'Monitor crypto/web3',
  'Track open source projects',
]

const KEYWORD_SUGGESTIONS = [
  'AI agents', 'LLM', 'solidity', 'smart contract',
  'bug bounty', 'web3', 'Next.js', 'Groq', 'React',
  'blockchain', 'DeFi', 'Immunefi', 'JavaScript', 'Python',
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goals, setGoals] = useState([])
  const [keywords, setKeywords] = useState([])
  const [customKeyword, setCustomKeyword] = useState('')
  const [subreddits, setSubreddits] = useState('')
  const [saving, setSaving] = useState(false)

  const colors = {
    bg: '#080c12',
    surface: '#0e1420',
    border: '#1e2d45',
    accent: '#00e5ff',
    accent2: '#7c3aed',
    text: '#e2eaf7',
    textMuted: '#4a6080',
    success: '#10b981',
  }

  const toggleGoal = (g) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  const toggleKeyword = (k) => setKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !keywords.includes(customKeyword.trim())) {
      setKeywords(prev => [...prev, customKeyword.trim()])
      setCustomKeyword('')
    }
  }

  async function finish() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }

    const custom_subreddits = subreddits.split(',').map(s => s.trim()).filter(Boolean)

    await supabase.from('profiles').upsert({
      id: user.id,
      name,
      goals,
      keywords,
      custom_subreddits,
    })

    window.location.href = '/dashboard'
  }

  const styles = {
    page: { minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", padding: '2rem' },
    card: { width: '100%', maxWidth: '560px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '2.5rem' },
    progress: { display: 'flex', gap: '6px', marginBottom: '2rem' },
    progressBar: (active, done) => ({ flex: 1, height: '3px', borderRadius: '2px', background: done ? colors.accent : active ? colors.accent + '60' : colors.border }),
    title: { fontSize: '20px', fontWeight: 700, color: colors.text, marginBottom: '8px' },
    subtitle: { fontSize: '12px', color: colors.textMuted, marginBottom: '2rem', lineHeight: 1.6 },
    chip: (selected) => ({ padding: '8px 14px', fontSize: '12px', border: `1px solid ${selected ? colors.accent : colors.border}`, borderRadius: '20px', background: selected ? colors.accent + '18' : 'transparent', color: selected ? colors.accent : colors.textMuted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', fontWeight: selected ? 700 : 400 }),
    input: { width: '100%', background: '#141c2e', border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '10px 14px', color: colors.text, fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', background: colors.accent, color: '#000', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', marginTop: '1.5rem' },
    skipBtn: { width: '100%', padding: '10px', background: 'transparent', color: colors.textMuted, border: `1px solid ${colors.border}`, borderRadius: '6px', fontSize: '11px', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' },
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.accent, letterSpacing: '0.2em' }}>⬡ DISPATCH</div>
        </div>

        <div style={styles.progress}>
          {STEPS.map((_, i) => <div key={i} style={styles.progressBar(i === step, i < step)} />)}
        </div>

        {step === 0 && (
          <div>
            <div style={styles.title}>Welcome to Dispatch.</div>
            <div style={styles.subtitle}>Your autonomous intelligence agent. Let's set it up in 2 minutes so it knows exactly what to watch for.</div>
            <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '1.5rem' }}>What should we call you?</div>
            <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            <button style={styles.btn} onClick={() => setStep(1)}>GET STARTED →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={styles.title}>What are your goals?</div>
            <div style={styles.subtitle}>Dispatch will prioritize signals that match what you're trying to achieve. Pick all that apply.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
              {GOAL_OPTIONS.map(g => (
                <button key={g} style={styles.chip(goals.includes(g))} onClick={() => toggleGoal(g)}>{g}</button>
              ))}
            </div>
            <button style={styles.btn} onClick={() => setStep(2)} disabled={goals.length === 0}>NEXT →</button>
            <button style={styles.skipBtn} onClick={() => setStep(2)}>SKIP</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={styles.title}>What topics interest you?</div>
            <div style={styles.subtitle}>Pick keywords — Dispatch will scan news, GitHub, Reddit and more for these topics.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
              {KEYWORD_SUGGESTIONS.map(k => (
                <button key={k} style={styles.chip(keywords.includes(k))} onClick={() => toggleKeyword(k)}>{k}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <input style={{ ...styles.input, flex: 1 }} value={customKeyword} onChange={e => setCustomKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomKeyword()} placeholder="Add custom keyword..." />
              <button onClick={addCustomKeyword} style={{ padding: '10px 16px', background: colors.accent, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>+</button>
            </div>
            {keywords.length > 0 && (
              <div style={{ marginTop: '12px', fontSize: '11px', color: colors.textMuted }}>
                Selected: {keywords.join(', ')}
              </div>
            )}
            <button style={styles.btn} onClick={() => setStep(3)} disabled={keywords.length === 0}>NEXT →</button>
            <button style={styles.skipBtn} onClick={() => setStep(3)}>SKIP</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={styles.title}>Any subreddits to watch?</div>
            <div style={styles.subtitle}>Dispatch already monitors popular subreddits. Add your own if you want more specific communities.</div>
            <input style={styles.input} value={subreddits} onChange={e => setSubreddits(e.target.value)} placeholder="e.g. netsec, ethfinance, SideProject" />
            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '8px' }}>Comma separated. Leave blank to use defaults.</div>
            <button style={styles.btn} onClick={() => setStep(4)}>NEXT →</button>
            <button style={styles.skipBtn} onClick={() => setStep(4)}>SKIP</button>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>⬡</div>
            <div style={styles.title}>You're all set.</div>
            <div style={styles.subtitle}>Dispatch will run tonight at 5am UTC and deliver your first brief tomorrow morning. You can update your settings anytime from the dashboard.</div>
            <div style={{ background: '#141c2e', border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              {name && <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '6px' }}>Name: <span style={{ color: colors.text }}>{name}</span></div>}
              <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '6px' }}>Goals: <span style={{ color: colors.text }}>{goals.length > 0 ? goals.join(', ') : 'None set'}</span></div>
              <div style={{ fontSize: '12px', color: colors.textMuted }}>Keywords: <span style={{ color: colors.text }}>{keywords.length > 0 ? keywords.join(', ') : 'None set'}</span></div>
            </div>
            <button style={styles.btn} onClick={finish} disabled={saving}>
              {saving ? 'SETTING UP...' : 'LAUNCH DISPATCH ↗'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}