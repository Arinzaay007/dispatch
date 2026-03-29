'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const STEPS = ['IDENTITY', 'OBJECTIVES', 'KEYWORDS', 'INTEL SOURCES', 'DEPLOY']

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
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const toggleGoal = g => setGoals(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g])
  const toggleKeyword = k => setKeywords(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !keywords.includes(customKeyword.trim())) {
      setKeywords(p => [...p, customKeyword.trim()])
      setCustomKeyword('')
    }
  }

  async function finish() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    const custom_subreddits = subreddits.split(',').map(s => s.trim()).filter(Boolean)
    await supabase.from('profiles').upsert({ id: user.id, name, goals, keywords, custom_subreddits })
    window.location.href = '/dashboard'
  }

  const C = {
    bg: '#080a0f',
    surface: 'rgba(13,17,23,0.98)',
    border: '#1a2535',
    accent: '#f97316',
    accent2: '#fb923c',
    text: '#e8ddd0',
    textMuted: '#4a5568',
    success: '#22c55e',
  }

  const chip = selected => ({
    padding: '7px 14px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
    border: `1px solid ${selected ? C.accent : C.border}`,
    borderRadius: '2px', background: selected ? `${C.accent}20` : 'transparent',
    color: selected ? C.accent : C.textMuted, cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s', fontWeight: selected ? 700 : 400,
  })

  const inp = {
    width: '100%', background: '#131920', border: `1px solid ${C.border}`,
    borderRadius: '3px', padding: '10px 14px', color: C.text,
    fontFamily: 'inherit', fontSize: '12px', outline: 'none', boxSizing: 'border-box',
  }

  const btn = disabled => ({
    width: '100%', padding: '12px', background: disabled ? '#1a2535' : C.accent,
    color: disabled ? C.textMuted : '#000', border: 'none', borderRadius: '3px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: "'Orbitron', monospace",
    marginTop: '1.5rem', transition: 'all 0.15s',
  })

  const skipBtn = {
    width: '100%', padding: '10px', background: 'transparent', color: C.textMuted,
    border: `1px solid ${C.border}`, borderRadius: '3px', fontSize: '10px',
    letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
    fontFamily: 'inherit', marginTop: '8px',
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono', monospace", padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .step-card { animation: fadeUp 0.4s ease forwards; }
        .chip-btn:hover { border-color: #f97316 !important; color: #f97316 !important; }
        .next-btn:hover:not(:disabled) { background: #fb923c !important; transform: translateY(-1px); }
        .inp-field:focus { border-color: #f97316 !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(#0f1419 1px, transparent 1px), linear-gradient(90deg, #0f1419 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.08), transparent)', animation: 'scanline 6s linear infinite' }} />
      </div>

      <div style={{ position: 'fixed', top: '20px', left: '20px', width: '30px', height: '30px', borderTop: `2px solid ${C.accent}30`, borderLeft: `2px solid ${C.accent}30` }} />
      <div style={{ position: 'fixed', top: '20px', right: '20px', width: '30px', height: '30px', borderTop: `2px solid ${C.accent}30`, borderRight: `2px solid ${C.accent}30` }} />
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', width: '30px', height: '30px', borderBottom: `2px solid ${C.accent}30`, borderLeft: `2px solid ${C.accent}30` }} />
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '30px', height: '30px', borderBottom: `2px solid ${C.accent}30`, borderRight: `2px solid ${C.accent}30` }} />
      <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: `${C.accent}50`, letterSpacing: '0.2em', fontFamily: "'Orbitron', monospace" }}>{time}</div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', fontWeight: 900, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.3em', marginBottom: '6px' }}>DISPATCH</div>
          <div style={{ fontSize: '9px', color: `${C.accent}60`, letterSpacing: '0.2em' }}>OPERATOR CONFIGURATION PROTOCOL</div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: '2px', background: i <= step ? C.accent : C.border, borderRadius: '1px', transition: 'background 0.3s' }} />
              <div style={{ fontSize: '7px', color: i <= step ? C.accent : C.textMuted, letterSpacing: '0.08em', marginTop: '4px', textAlign: 'center', display: "block" }}>{s}</div>
            </div>
          ))}
        </div>

        <div className="step-card" key={step} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '4px', padding: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '14px', height: '14px', borderTop: `2px solid ${C.accent}`, borderLeft: `2px solid ${C.accent}` }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '14px', height: '14px', borderTop: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '14px', height: '14px', borderBottom: `2px solid ${C.accent}`, borderLeft: `2px solid ${C.accent}` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', borderBottom: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}` }} />

          {step === 0 && (
            <div>
              <div style={{ fontSize: '9px', color: `${C.accent}60`, letterSpacing: '0.2em', marginBottom: '8px' }}>// STEP 01 OF 04</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, color: C.text, marginBottom: '8px', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IDENTITY VERIFICATION</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', lineHeight: 1.6 }}>Dispatch needs to know who it's working for. Enter your callsign to personalize your morning briefs.</div>
              <label style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${C.accent}70`, marginBottom: '6px', display: 'block' }}>CALLSIGN (YOUR NAME)</label>
              <input className="inp-field" style={inp} value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && setStep(1)} placeholder="Enter your name..." />
              <button className="next-btn" style={btn(false)} onClick={() => setStep(1)}>CONFIRM IDENTITY →</button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ fontSize: '9px', color: `${C.accent}60`, letterSpacing: '0.2em', marginBottom: '8px' }}>// STEP 02 OF 04</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, marginBottom: '8px', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MISSION OBJECTIVES</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', lineHeight: 1.6 }}>What is Dispatch working towards? Select all objectives that apply — the agent will prioritize signals accordingly.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                {GOAL_OPTIONS.map(g => (
                  <button key={g} className="chip-btn" style={chip(goals.includes(g))} onClick={() => toggleGoal(g)}>{goals.includes(g) ? '✓ ' : ''}{g}</button>
                ))}
              </div>
              {goals.length > 0 && <div style={{ fontSize: '9px', color: C.success, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{goals.length} OBJECTIVE{goals.length > 1 ? 'S' : ''} SELECTED</div>}
              <button className="next-btn" style={btn(goals.length === 0)} onClick={() => setStep(2)} disabled={goals.length === 0}>LOCK OBJECTIVES →</button>
              <button style={skipBtn} onClick={() => setStep(2)}>SKIP THIS STEP</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: '9px', color: `${C.accent}60`, letterSpacing: '0.2em', marginBottom: '8px' }}>// STEP 03 OF 04</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, marginBottom: '8px', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TARGET KEYWORDS</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', lineHeight: 1.6 }}>Select topics for Dispatch to monitor across all intel sources. Add custom targets below.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {KEYWORD_SUGGESTIONS.map(k => (
                  <button key={k} className="chip-btn" style={chip(keywords.includes(k))} onClick={() => toggleKeyword(k)}>{keywords.includes(k) ? '✓ ' : ''}{k}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input className="inp-field" style={{ ...inp, flex: 1 }} value={customKeyword} onChange={e => setCustomKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomKeyword()} placeholder="Add custom target..." />
                <button onClick={addCustomKeyword} style={{ padding: '10px 16px', background: C.accent, color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '12px' }}>+</button>
              </div>
              {keywords.length > 0 && <div style={{ fontSize: '9px', color: C.success, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{keywords.length} TARGET{keywords.length > 1 ? 'S' : ''}: {keywords.join(', ')}</div>}
              <button className="next-btn" style={btn(keywords.length === 0)} onClick={() => setStep(3)} disabled={keywords.length === 0}>LOCK TARGETS →</button>
              <button style={skipBtn} onClick={() => setStep(3)}>SKIP THIS STEP</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: '9px', color: `${C.accent}60`, letterSpacing: '0.2em', marginBottom: '8px' }}>// STEP 04 OF 04</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, marginBottom: '8px', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>INTEL SOURCES</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', lineHeight: 1.6 }}>Dispatch already monitors 8 default sources. Add custom subreddits for more targeted intelligence.</div>
              <label style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${C.accent}70`, marginBottom: '6px', display: 'block' }}>CUSTOM SUBREDDITS (COMMA SEPARATED)</label>
              <input className="inp-field" style={inp} value={subreddits} onChange={e => setSubreddits(e.target.value)} placeholder="e.g. netsec, ethfinance, SideProject" />
              <div style={{ fontSize: '9px', color: C.textMuted, marginTop: '6px', letterSpacing: '0.05em' }}>Leave blank to use default sources only.</div>
              <button className="next-btn" style={btn(false)} onClick={() => setStep(4)}>CONFIRM SOURCES →</button>
              <button style={skipBtn} onClick={() => setStep(4)}>SKIP THIS STEP</button>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '32px', color: C.accent, marginBottom: '1rem' }}>◈</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '16px', fontWeight: 700, marginBottom: '8px', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AGENT READY FOR DEPLOYMENT</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', lineHeight: 1.7 }}>Dispatch will run tonight at 05:00 UTC and deliver your first intelligence brief tomorrow morning.</div>
              <div style={{ background: '#131920', border: `1px solid ${C.border}`, borderRadius: '3px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                {name && <div style={{ fontSize: '10px', color: C.textMuted, marginBottom: '6px', letterSpacing: '0.05em' }}>CALLSIGN: <span style={{ color: C.accent }}>{name.toUpperCase()}</span></div>}
                <div style={{ fontSize: '10px', color: C.textMuted, marginBottom: '6px', letterSpacing: '0.05em' }}>OBJECTIVES: <span style={{ color: C.text }}>{goals.length > 0 ? goals.length + ' SET' : 'NONE'}</span></div>
                <div style={{ fontSize: '10px', color: C.textMuted, letterSpacing: '0.05em' }}>TARGETS: <span style={{ color: C.text }}>{keywords.length > 0 ? keywords.join(', ') : 'NONE SET'}</span></div>
              </div>
              <button className="next-btn" style={{ ...btn(false), marginTop: 0 }} onClick={finish} disabled={saving}>
                {saving ? 'DEPLOYING AGENT...' : 'DEPLOY DISPATCH ↗'}
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '9px', color: `${C.accent}25`, letterSpacing: '0.15em' }}>
          DISPATCH // SECURE CONFIGURATION // v1.0
        </div>
      </div>
    </div>
  )
}
