'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const NAV = ['Brief', 'Signals', 'Drafts', 'Jobs', 'Log', 'Settings']

const SOURCE_ICONS = {
  newsapi: '📡',
  reddit: '🔴',
  github: '⬡',
  jobs: '💼',
  hackernews: '🔶',
  show_hn: '🔷',
  crypto: '₿',
  bugbounty: '🛡',
  default: '◈'
}

export default function Dashboard() {
  const [theme, setTheme] = useState('dark')
  const [active, setActive] = useState('Brief')
  const [signals, setSignals] = useState([])
  const [briefing, setBriefing] = useState(null)
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [settingsName, setSettingsName] = useState('')
  const [settingsGoals, setSettingsGoals] = useState('')
  const [settingsKeywords, setSettingsKeywords] = useState('')
  const [settingsSubreddits, setSettingsSubreddits] = useState('')
  const [saveMsg, setSaveMsg] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const [time, setTime] = useState('')

  const dark = theme === 'dark'

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) { window.location.href = '/auth'; return }
      const { data: sigs } = await supabase.from('signals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100)
      const { data: brief } = await supabase.from('briefings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single()
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setSignals(sigs || [])
      setBriefing(brief || null)
      setProfile(prof || null)
      setSettingsName(prof?.name || '')
      setSettingsGoals(prof?.goals?.join(', ') || '')
      setSettingsKeywords(prof?.keywords?.join(', ') || '')
      setSettingsSubreddits(prof?.custom_subreddits?.join(', ') || '')
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    if (!user) return
    const goals = settingsGoals.split(',').map(s => s.trim()).filter(Boolean)
    const keywords = settingsKeywords.split(',').map(s => s.trim()).filter(Boolean)
    const custom_subreddits = settingsSubreddits.split(',').map(s => s.trim()).filter(Boolean)
    const { error } = await supabase.from('profiles').upsert({ id: user.id, name: settingsName, goals, keywords, custom_subreddits })
    if (error) setSaveMsg('Error saving.')
    else setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const drafts = signals.filter(s => s.draft)
  const jobs = signals.filter(s => s.source === 'jobs')
  const reviewCount = signals.filter(s => s.needs_review).length
  const highCount = signals.filter(s => s.score === 'high').length
  const filtered = signals.filter(s => {
    const matchSource = filter === 'all' || s.source === filter
    const matchSearch = !search || s.title?.toLowerCase().includes(search.toLowerCase())
    return matchSource && matchSearch
  })

  const C = {
    bg: dark ? '#080a0f' : '#f0ede8',
    surface: dark ? '#0d1117' : '#ffffff',
    surface2: dark ? '#131920' : '#faf8f5',
    border: dark ? '#1a2535' : '#e5e0d8',
    borderGlow: dark ? '#f97316' : '#ea580c',
    accent: '#f97316',
    accent2: '#fb923c',
    accentDark: '#ea580c',
    text: dark ? '#e8ddd0' : '#1a1208',
    textMuted: dark ? '#4a5568' : '#78716c',
    high: '#f97316',
    med: '#eab308',
    low: dark ? '#2d3748' : '#a8a29e',
    success: '#22c55e',
    danger: '#ef4444',
    grid: dark ? '#0f1419' : '#f5f0e8',
  }

  const scoreColor = s => s === 'high' ? C.high : s === 'medium' ? C.med : C.low
  const scoreBg = s => {
    if (s === 'high') return dark ? '#f9731615' : '#fff7ed'
    if (s === 'medium') return dark ? '#eab30815' : '#fefce8'
    return dark ? '#2d374820' : '#f5f5f4'
  }

  const glowCard = {
    background: dark ? 'rgba(13,17,23,0.95)' : 'rgba(255,255,255,0.95)',
    border: `1px solid ${C.border}`,
    borderRadius: '4px',
    padding: '1.25rem',
    boxShadow: dark ? `0 0 0 1px ${C.border}, inset 0 1px 0 rgba(249,115,22,0.05)` : `0 1px 3px rgba(0,0,0,0.08)`,
    position: 'relative',
    overflow: 'hidden',
  }

  const cornerAccent = {
    position: 'absolute', top: 0, left: 0, width: '12px', height: '12px',
    borderTop: `2px solid ${C.accent}`, borderLeft: `2px solid ${C.accent}`,
  }

  const tag = s => ({
    fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '2px 7px', borderRadius: '2px',
    background: scoreBg(s), color: scoreColor(s), fontWeight: 700,
    border: `1px solid ${scoreColor(s)}30`,
  })

  const sourceTag = src => ({
    fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
    color: C.accent, background: `${C.accent}15`,
    padding: '2px 7px', borderRadius: '2px', border: `1px solid ${C.accent}30`,
  })

  const inp = {
    width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: '3px', padding: '9px 12px', color: C.text,
    fontFamily: 'inherit', fontSize: '12px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '10px',
  }

  const lbl = {
    fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: '5px', display: 'block',
  }

  const btn = {
    padding: '9px 20px', background: C.accent, color: '#000',
    border: 'none', borderRadius: '3px', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const pill = a => ({
    fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '4px 10px', borderRadius: '2px',
    border: `1px solid ${a ? C.accent : C.border}`,
    background: a ? `${C.accent}20` : 'transparent',
    color: a ? C.accent : C.textMuted, cursor: 'pointer', fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  })

  const sectionHeader = (title, sub) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ width: '3px', height: '18px', background: C.accent, borderRadius: '1px' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</span>
        {sub && <span style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.1em', marginLeft: 'auto' }}>{sub}</span>}
      </div>
      <div style={{ height: '1px', background: `linear-gradient(90deg, ${C.accent}40, transparent)`, marginLeft: '13px' }} />
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: C.accent, marginBottom: '16px' }}>DISPATCH // INITIALIZING</div>
      <div style={{ width: '200px', height: '2px', background: C.border, borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: C.accent, animation: 'load 1.5s ease infinite', width: '40%' }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Share Tech Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes scanline { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        @keyframes pulse-border { 0%, 100% { box-shadow: 0 0 0 1px rgba(249,115,22,0.1); } 50% { box-shadow: 0 0 8px 1px rgba(249,115,22,0.2); } }
        @keyframes load { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .glow-card { animation: pulse-border 4s ease infinite; }
        .glow-card:hover { border-color: ${C.accent}60 !important; box-shadow: 0 0 12px rgba(249,115,22,0.15) !important; }
        .nav-btn:hover { color: ${C.accent} !important; background: ${C.accent}10 !important; }
        .pill-btn:hover { border-color: ${C.accent} !important; color: ${C.accent} !important; }
        .signal-row:hover { background: ${dark ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.02)'} !important; }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .main-grid { grid-template-columns: 1fr !important; }
          .settings-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
        @media (min-width: 641px) { .mobile-nav { display: none !important; } .mobile-btn { display: none !important; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.bg}; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${C.accent}08, transparent)`, animation: 'scanline 6s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: dark ? 0.6 : 0.4 }} />
      </div>

      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', height: '52px', borderBottom: `1px solid ${C.border}`, background: dark ? 'rgba(8,10,15,0.95)' : 'rgba(240,237,232,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', fontWeight: 900, letterSpacing: '0.2em', color: C.accent }}>DISPATCH</div>
          <div style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.success, animation: 'blink 2s infinite', display: 'inline-block' }} />
            SYS ONLINE
          </div>
        </div>

        <nav className="desktop-nav" style={{ display: 'flex', gap: '2px' }}>
          {NAV.map(n => (
            <button key={n} className="nav-btn" onClick={() => setActive(n)} style={{ padding: '5px 12px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', background: active === n ? `${C.accent}18` : 'transparent', color: active === n ? C.accent : C.textMuted, border: active === n ? `1px solid ${C.accent}50` : '1px solid transparent', borderRadius: '3px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>{n}</button>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.1em', fontFamily: "'Orbitron', monospace" }}>{time}</div>
          <button onClick={() => setTheme(dark ? 'light' : 'dark')} style={{ fontSize: '9px', padding: '4px 10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '3px', color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.1em' }}>{dark ? 'LIGHT' : 'DARK'}</button>
          <button onClick={signOut} style={{ fontSize: '9px', padding: '4px 10px', background: 'transparent', border: `1px solid ${C.danger}40`, borderRadius: '3px', color: C.danger, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.1em' }}>EXIT</button>
          <button className="mobile-btn" onClick={() => setNavOpen(!navOpen)} style={{ display: 'none', fontSize: '14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '3px', color: C.textMuted, cursor: 'pointer', padding: '3px 8px' }}>☰</button>
        </div>
      </div>

      {navOpen && (
        <div className="mobile-nav" style={{ position: 'sticky', top: '52px', zIndex: 99, background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {NAV.map(n => (
            <button key={n} onClick={() => { setActive(n); setNavOpen(false) }} style={{ display: 'block', width: '100%', padding: '12px 1.25rem', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', background: active === n ? `${C.accent}15` : 'transparent', color: active === n ? C.accent : C.textMuted, border: 'none', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>{n}</button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>

        {/* BRIEF */}
        {active === 'Brief' && (
          <div>
            {sectionHeader('Morning Brief', new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase())}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 700, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
                GOOD MORNING, {(profile?.name || user?.email?.split('@')[0] || 'AGENT').toUpperCase()}.
              </div>
              <div style={{ fontSize: '11px', color: C.textMuted, letterSpacing: '0.05em' }}>Intelligence report compiled. Awaiting your review.</div>
            </div>

            {/* Stats */}
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { num: briefing?.signal_count || signals.length, label: 'Signals', color: C.text, icon: '◈' },
                { num: highCount, label: 'Priority', color: C.high, icon: '▲' },
                { num: briefing?.action_count || 0, label: 'Actions', color: C.success, icon: '✓' },
                { num: reviewCount, label: 'Review', color: C.danger, icon: '!' },
              ].map((s, i) => (
                <div key={i} className="glow-card" style={{ ...glowCard }}>
                  <div style={cornerAccent} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', color: C.textMuted, letterSpacing: '0.1em' }}>{s.icon}</span>
                    <span style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.num}</div>
                </div>
              ))}
            </div>

            <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '12px' }}>
              <div className="glow-card" style={{ ...glowCard }}>
                <div style={cornerAccent} />
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '1rem' }}>// PRIORITY SIGNALS</div>
                {signals.filter(s => s.score === 'high').slice(0, 8).map((s, i) => (
                  <div key={i} className="signal-row" style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={sourceTag(s.source)}>{SOURCE_ICONS[s.source] || SOURCE_ICONS.default} {s.source}</span>
                      <span style={tag(s.score)}>{s.score}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: C.text, lineHeight: 1.5 }}>{s.title}</div>
                    <div style={{ fontSize: '10px', color: C.textMuted, marginTop: '3px' }}>{s.action_taken}</div>
                  </div>
                ))}
                {signals.filter(s => s.score === 'high').length === 0 && <div style={{ fontSize: '11px', color: C.textMuted, padding: '2rem 0', textAlign: 'center' }}>NO PRIORITY SIGNALS DETECTED</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Source chart */}
                <div className="glow-card" style={{ ...glowCard }}>
                  <div style={cornerAccent} />
                  <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '1rem' }}>// SOURCE INTEL</div>
                  {['newsapi', 'reddit', 'github', 'hackernews', 'crypto', 'bugbounty', 'jobs'].map(src => {
                    const count = signals.filter(s => s.source === src).length
                    const pct = signals.length ? Math.round((count / signals.length) * 100) : 0
                    return (
                      <div key={src} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{src}</span>
                          <span style={{ fontSize: '9px', color: count > 0 ? C.accent : C.textMuted, fontFamily: "'Orbitron', monospace" }}>{count}</span>
                        </div>
                        <div style={{ height: '3px', background: C.border, borderRadius: '1px' }}>
                          <div style={{ height: '3px', width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, borderRadius: '1px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Attention */}
                <div className="glow-card" style={{ ...glowCard }}>
                  <div style={cornerAccent} />
                  <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '1rem' }}>// NEEDS ATTENTION</div>
                  {signals.filter(s => s.needs_review).slice(0, 3).map((s, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '8px' }}>
                      <span style={{ color: C.danger, fontSize: '10px', flexShrink: 0 }}>▲</span>
                      <div>
                        <div style={{ fontSize: '11px', color: C.text, lineHeight: 1.4 }}>{s.title?.slice(0, 50)}...</div>
                        <div style={{ fontSize: '9px', color: C.textMuted, marginTop: '2px', letterSpacing: '0.05em' }}>{s.source}</div>
                      </div>
                    </div>
                  ))}
                  {signals.filter(s => s.needs_review).length === 0 && <div style={{ fontSize: '10px', color: C.success, letterSpacing: '0.05em' }}>ALL CLEAR. NO REVIEW NEEDED.</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIGNALS */}
        {active === 'Signals' && (
          <div>
            {sectionHeader('Signal Feed', `${filtered.length} RESULTS`)}
            <div style={{ marginBottom: '1rem' }}>
              <input style={{ ...inp, marginBottom: '10px' }} placeholder="// SEARCH SIGNALS..." value={search} onChange={e => setSearch(e.target.value)} />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'newsapi', 'reddit', 'github', 'jobs', 'hackernews', 'show_hn', 'crypto', 'bugbounty'].map(f => (
                  <button key={f} className="pill-btn" style={pill(filter === f)} onClick={() => setFilter(f)}>{SOURCE_ICONS[f] || '◈'} {f}</button>
                ))}
              </div>
            </div>
            <div className="glow-card" style={{ ...glowCard }}>
              <div style={cornerAccent} />
              {filtered.map((s, i) => (
                <div key={i} className="signal-row" style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={sourceTag(s.source)}>{SOURCE_ICONS[s.source] || '◈'} {s.source}</span>
                    <span style={tag(s.score)}>{s.score}</span>
                    {s.needs_review && <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '2px', background: `${C.danger}15`, color: C.danger, fontWeight: 700, border: `1px solid ${C.danger}30`, letterSpacing: '0.1em' }}>REVIEW</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: C.text, lineHeight: 1.5, marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: C.textMuted, letterSpacing: '0.05em' }}>{s.action_taken}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: C.accent, textDecoration: 'none', letterSpacing: '0.1em', border: `1px solid ${C.accent}40`, padding: '2px 8px', borderRadius: '2px' }}>ACCESS ↗</a>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '11px', color: C.textMuted, letterSpacing: '0.1em' }}>NO SIGNALS MATCH QUERY</div>}
            </div>
          </div>
        )}

        {/* DRAFTS */}
        {active === 'Drafts' && (
          <div>
            {sectionHeader('Draft Transmissions', `${drafts.length} PENDING`)}
            {drafts.length === 0 ? (
              <div className="glow-card" style={{ ...glowCard, textAlign: 'center', padding: '3rem', color: C.textMuted, fontSize: '11px', letterSpacing: '0.1em' }}>
                <div style={cornerAccent} />
                NO DRAFTS IN QUEUE. RUN AGENT TO GENERATE.
              </div>
            ) : drafts.map((s, i) => (
              <div key={i} className="glow-card" style={{ ...glowCard, borderLeft: `3px solid ${C.accent}`, marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={sourceTag(s.source)}>{SOURCE_ICONS[s.source] || '◈'} {s.source}</span>
                  <span style={tag(s.score)}>{s.score}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '9px', color: C.textMuted, letterSpacing: '0.05em' }}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '10px', color: C.textMuted, marginBottom: '8px', letterSpacing: '0.05em' }}>SOURCE: {s.title?.slice(0, 60)}...</div>
                <div style={{ fontSize: '12px', color: C.text, lineHeight: 1.7, background: dark ? 'rgba(249,115,22,0.04)' : 'rgba(249,115,22,0.03)', padding: '12px', borderRadius: '3px', borderLeft: `2px solid ${C.accent}30`, marginBottom: '10px' }}>{s.draft}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button style={{ ...btn, background: C.success, fontSize: '10px', padding: '7px 16px' }}>✓ APPROVE + TRANSMIT</button>
                  <button style={{ ...btn, background: 'transparent', color: C.textMuted, border: `1px solid ${C.border}`, fontSize: '10px', padding: '7px 16px' }}>✕ DISCARD</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JOBS */}
        {active === 'Jobs' && (
          <div>
            {sectionHeader('Job Intel', `${jobs.length} LISTINGS`)}
            {jobs.length === 0 ? (
              <div className="glow-card" style={{ ...glowCard, textAlign: 'center', padding: '3rem', color: C.textMuted, fontSize: '11px', letterSpacing: '0.1em' }}>
                <div style={cornerAccent} />
                NO JOB LISTINGS DETECTED.
              </div>
            ) : jobs.map((s, i) => (
              <div key={i} className="glow-card" style={{ ...glowCard, marginBottom: '10px' }}>
                <div style={cornerAccent} />
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: C.text, fontWeight: 700, marginBottom: '6px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: C.textMuted, lineHeight: 1.6, marginBottom: '10px' }}>{s.summary?.slice(0, 180)}...</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={tag(s.score)}>{s.score} MATCH</span>
                  {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ ...btn, textDecoration: 'none', fontSize: '10px', padding: '7px 14px' }}>APPLY ↗</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOG */}
        {active === 'Log' && (
          <div>
            {sectionHeader('Agent Activity Log', `${signals.length} ENTRIES`)}
            <div className="glow-card" style={{ ...glowCard }}>
              <div style={cornerAccent} />
              {signals.slice(0, 50).map((s, i) => (
                <div key={i} className="signal-row" style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '9px', color: C.accent, fontFamily: "'Orbitron', monospace", minWidth: '40px', marginTop: '2px' }}>{new Date(s.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: C.text, lineHeight: 1.5 }}>
                      <span style={{ color: scoreColor(s.score), marginRight: '6px' }}>[{s.score?.toUpperCase()}]</span>
                      {s.action_taken} — {s.title?.slice(0, 65)}{s.title?.length > 65 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: '9px', color: C.textMuted, marginTop: '2px', letterSpacing: '0.05em' }}>SRC: {s.source}</div>
                  </div>
                </div>
              ))}
              {signals.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '11px', color: C.textMuted, letterSpacing: '0.1em' }}>NO LOG ENTRIES</div>}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {active === 'Settings' && (
          <div>
            {sectionHeader('System Configuration', '')}
            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="glow-card" style={{ ...glowCard }}>
                <div style={cornerAccent} />
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '1.5rem' }}>// OPERATOR PROFILE</div>
                <label style={lbl}>Callsign (name)</label>
                <input style={inp} value={settingsName} onChange={e => setSettingsName(e.target.value)} placeholder="Your name" />
                <label style={lbl}>Mission objectives (goals)</label>
                <input style={inp} value={settingsGoals} onChange={e => setSettingsGoals(e.target.value)} placeholder="find remote jobs, grow audience..." />
                <label style={lbl}>Target keywords</label>
                <input style={inp} value={settingsKeywords} onChange={e => setSettingsKeywords(e.target.value)} placeholder="AI agents, solidity, bug bounty..." />
                <label style={lbl}>Intel subreddits</label>
                <input style={inp} value={settingsSubreddits} onChange={e => setSettingsSubreddits(e.target.value)} placeholder="web3, netsec, defi..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={btn} onClick={saveProfile}>SAVE CONFIG</button>
                  {saveMsg && <span style={{ fontSize: '10px', color: saveMsg === 'Saved!' ? C.success : C.danger, letterSpacing: '0.1em' }}>{saveMsg}</span>}
                </div>
              </div>
              <div className="glow-card" style={{ ...glowCard }}>
                <div style={cornerAccent} />
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '1.5rem' }}>// SYSTEM STATUS</div>
                <label style={lbl}>Schedule</label>
                <input style={inp} defaultValue="DAILY // 05:00 UTC" disabled />
                <label style={lbl}>Operator ID</label>
                <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '1.5rem', wordBreak: 'break-all' }}>{user?.email}</div>
                <label style={lbl}>Active intel sources</label>
                {[
                  { name: 'NewsAPI / RSS', status: 'ONLINE' },
                  { name: 'Reddit', status: 'ONLINE' },
                  { name: 'GitHub', status: 'ONLINE' },
                  { name: 'Jobs (Remotive)', status: 'ONLINE' },
                  { name: 'Hacker News', status: 'ONLINE' },
                  { name: 'Crypto RSS', status: 'ONLINE' },
                  { name: 'Bug Bounty', status: 'ONLINE' },
                ].map(src => (
                  <div key={src.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: '11px', color: C.text }}>{src.name}</span>
                    <span style={{ fontSize: '9px', color: C.success, letterSpacing: '0.1em' }}>● {src.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
