'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const NAV = ['Brief', 'Signals', 'Drafts', 'Jobs', 'Log', 'Settings']

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
  const [menuOpen, setMenuOpen] = useState(false)

  const dark = theme === 'dark'

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

  const c = {
    bg: dark ? '#080c12' : '#f0f2f5',
    surface: dark ? '#0e1420' : '#ffffff',
    surface2: dark ? '#141c2e' : '#f8f9fc',
    border: dark ? '#1e2d45' : '#e2e8f0',
    accent: '#00e5ff',
    accent2: '#7c3aed',
    text: dark ? '#e2eaf7' : '#0f172a',
    muted: dark ? '#4a6080' : '#64748b',
    high: dark ? '#00e5ff' : '#0891b2',
    med: dark ? '#f59e0b' : '#d97706',
    low: dark ? '#2a3f5c' : '#94a3b8',
    success: '#10b981',
    danger: '#ef4444',
  }

  const scoreColor = s => s === 'high' ? c.high : s === 'medium' ? c.med : c.low
  const scoreBg = s => s === 'high' ? (dark ? '#00e5ff18' : '#e0f9ff') : s === 'medium' ? (dark ? '#f59e0b18' : '#fef3c7') : (dark ? '#1e2d4520' : '#f1f5f9')

  const tag = (s) => ({ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: scoreBg(s), color: scoreColor(s), fontWeight: 700 })
  const srcTag = { fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: c.muted, background: dark ? '#1e2d45' : '#f1f5f9', padding: '2px 7px', borderRadius: '3px' }
  const card = { background: c.surface, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '1.25rem' }
  const input = { width: '100%', background: c.surface2, border: `1px solid ${c.border}`, borderRadius: '6px', padding: '10px 14px', color: c.text, fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }
  const label = { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '6px', display: 'block' }
  const saveBtn = { padding: '10px 24px', background: c.accent, color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }
  const pill = (a) => ({ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '3px', border: `1px solid ${a ? c.accent : c.border}`, background: a ? `${c.accent}15` : 'transparent', color: a ? c.accent : c.muted, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' })
  const accentLine = { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})` }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', letterSpacing: '0.2em', color: c.accent, fontFamily: 'monospace' }}>
      DISPATCH // LOADING...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .brief-grid { grid-template-columns: 1fr !important; }
          .settings-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .topbar-right { gap: 6px !important; }
          .main-pad { padding: 1rem !important; }
          .search-input { width: 100% !important; }
          .filter-row { flex-direction: column !important; gap: 10px !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', height: '56px', borderBottom: `1px solid ${c.border}`, background: c.surface, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.2em', color: c.accent }}>⬡ DISPATCH</div>
        
        {/* Desktop nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2px' }}>
          {NAV.map(n => (
            <button key={n} onClick={() => setActive(n)} style={{ padding: '6px 12px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: active === n ? `${c.accent}18` : 'transparent', color: active === n ? c.accent : c.muted, border: active === n ? `1px solid ${c.accent}40` : '1px solid transparent', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}>{n}</button>
          ))}
        </nav>

        <div className="topbar-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setTheme(dark ? 'light' : 'dark')} style={{ fontSize: '11px', padding: '5px 10px', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '4px', color: c.muted, cursor: 'pointer', fontFamily: 'inherit' }}>{dark ? '◑' : '◐'}</button>
          <button onClick={signOut} style={{ fontSize: '11px', padding: '5px 10px', background: 'transparent', border: `1px solid ${c.danger}40`, borderRadius: '4px', color: c.danger, cursor: 'pointer', fontFamily: 'inherit' }}>OUT</button>
          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: '16px', padding: '5px 8px', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '4px', color: c.muted, cursor: 'pointer', fontFamily: 'inherit', alignItems: 'center' }}>☰</button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="mobile-nav" style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: '56px', zIndex: 99 }}>
          {NAV.map(n => (
            <button key={n} onClick={() => { setActive(n); setMenuOpen(false) }} style={{ padding: '10px 14px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', background: active === n ? `${c.accent}18` : 'transparent', color: active === n ? c.accent : c.muted, border: active === n ? `1px solid ${c.accent}40` : '1px solid transparent', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>{n}</button>
          ))}
        </div>
      )}

      <div className="main-pad" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>

        {/* BRIEF */}
        {active === 'Brief' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>◈</span> Morning Brief
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: c.muted }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: c.text, marginBottom: '4px' }}>Good morning, {profile?.name || user?.email?.split('@')[0] || 'Agent'}.</div>
              <div style={{ fontSize: '12px', color: c.muted }}>Dispatch ran overnight. Here's your brief.</div>
            </div>
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { num: briefing?.signal_count || signals.length, label: 'Signals', color: c.text },
                { num: highCount, label: 'High', color: c.high },
                { num: briefing?.action_count || 0, label: 'Actions', color: c.success },
                { num: reviewCount, label: 'Review', color: c.danger },
              ].map((s, i) => (
                <div key={i} style={{ ...card, position: 'relative', overflow: 'hidden', padding: '1rem' }}>
                  <div style={accentLine} />
                  <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.num}</div>
                  <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="brief-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px' }}>
              <div style={card}>
                <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '1rem' }}>Top signals</div>
                {signals.filter(s => s.score === 'high').slice(0, 6).map((s, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={srcTag}>{s.source}</span>
                      <span style={tag(s.score)}>{s.score}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: c.text, lineHeight: 1.4 }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: c.muted, marginTop: '3px' }}>{s.action_taken}</div>
                  </div>
                ))}
                {signals.filter(s => s.score === 'high').length === 0 && <div style={{ fontSize: '12px', color: c.muted, padding: '2rem 0', textAlign: 'center' }}>No high-relevance signals yet.</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={card}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '1rem' }}>Needs attention</div>
                  {signals.filter(s => s.needs_review).slice(0, 4).map((s, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: '8px' }}>
                      <span style={{ color: c.danger }}>▲</span>
                      <div>
                        <div style={{ fontSize: '12px', color: c.text, lineHeight: 1.4 }}>{s.title?.slice(0, 55)}...</div>
                        <div style={{ fontSize: '10px', color: c.muted, marginTop: '2px' }}>{s.source} · {s.action_taken}</div>
                      </div>
                    </div>
                  ))}
                  {signals.filter(s => s.needs_review).length === 0 && <div style={{ fontSize: '12px', color: c.muted }}>Nothing needs your attention.</div>}
                </div>
                <div style={card}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '1rem' }}>Source breakdown</div>
                  {['newsapi', 'reddit', 'github', 'jobs', 'hackernews', 'crypto', 'bugbounty'].map(src => {
                    const count = signals.filter(s => s.source === src).length
                    const pct = signals.length ? Math.round((count / signals.length) * 100) : 0
                    return (
                      <div key={src} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '10px', color: c.muted, textTransform: 'uppercase' }}>{src}</span>
                          <span style={{ fontSize: '10px', color: c.text }}>{count}</span>
                        </div>
                        <div style={{ height: '3px', background: c.border, borderRadius: '2px' }}>
                          <div style={{ height: '3px', width: `${pct}%`, background: c.accent, borderRadius: '2px' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIGNALS */}
        {active === 'Signals' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem' }}>◈ Signal Feed</div>
            <div className="filter-row" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <input className="search-input" style={{ background: c.surface2, border: `1px solid ${c.border}`, borderRadius: '6px', padding: '8px 14px', color: c.text, fontFamily: 'inherit', fontSize: '12px', outline: 'none', width: '220px' }} placeholder="Search signals..." value={search} onChange={e => setSearch(e.target.value)} />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'newsapi', 'reddit', 'github', 'jobs', 'hackernews', 'crypto', 'bugbounty'].map(f => (
                  <button key={f} style={pill(filter === f)} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div style={card}>
              {filtered.map((s, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${c.border}` }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <span style={srcTag}>{s.source}</span>
                    <span style={tag(s.score)}>{s.score}</span>
                    {s.needs_review && <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: dark ? '#ef444418' : '#fee2e2', color: c.danger, fontWeight: 700 }}>review</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: c.text, lineHeight: 1.5, marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: c.muted }}>{s.action_taken}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: c.accent, textDecoration: 'none' }}>OPEN ↗</a>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '12px', color: c.muted }}>No signals found.</div>}
            </div>
          </div>
        )}

        {/* DRAFTS */}
        {active === 'Drafts' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem' }}>◈ Drafts Ready for Review</div>
            {drafts.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '3rem', color: c.muted, fontSize: '12px' }}>No drafts yet. Run the agent to generate content drafts.</div>
            ) : drafts.map((s, i) => (
              <div key={i} style={{ ...card, borderLeft: `3px solid ${c.accent}`, marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={srcTag}>{s.source}</span>
                  <span style={tag(s.score)}>{s.score}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: c.muted }}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: c.muted, marginBottom: '8px' }}>Signal: {s.title}</div>
                <div style={{ fontSize: '13px', color: c.text, lineHeight: 1.7, background: dark ? '#ffffff06' : '#00000006', padding: '14px', borderRadius: '6px' }}>{s.draft}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button style={{ ...saveBtn, background: c.success }}>✓ APPROVE</button>
                  <button style={{ ...saveBtn, background: 'transparent', color: c.muted, border: `1px solid ${c.border}` }}>✕ DISCARD</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JOBS */}
        {active === 'Jobs' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem' }}>◈ Job Applications</div>
            {jobs.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '3rem', color: c.muted, fontSize: '12px' }}>No job listings found yet.</div>
            ) : jobs.map((s, i) => (
              <div key={i} style={{ ...card, marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', color: c.text, fontWeight: 700, marginBottom: '6px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: c.muted, lineHeight: 1.6, marginBottom: '10px' }}>{s.summary?.slice(0, 180)}...</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={tag(s.score)}>{s.score} match</span>
                  {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ ...saveBtn, textDecoration: 'none', padding: '7px 16px' }}>VIEW ↗</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOG */}
        {active === 'Log' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem' }}>◈ Agent Activity Log</div>
            <div style={card}>
              {signals.slice(0, 50).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${c.border}`, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', color: c.accent, fontFamily: 'inherit', minWidth: '38px', marginTop: '2px' }}>{new Date(s.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: c.text, lineHeight: 1.5 }}>
                      <span style={{ color: scoreColor(s.score) }}>[{s.score?.toUpperCase()}]</span>{' '}{s.action_taken} — {s.title?.slice(0, 60)}{s.title?.length > 60 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: '10px', color: c.muted, marginTop: '2px' }}>source: {s.source}</div>
                  </div>
                </div>
              ))}
              {signals.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '12px', color: c.muted }}>No activity yet.</div>}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {active === 'Settings' && (
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, marginBottom: '1.5rem' }}>◈ Settings</div>
            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={card}>
                <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '1.5rem' }}>Profile</div>
                <label style={label}>Name</label>
                <input style={input} value={settingsName} onChange={e => setSettingsName(e.target.value)} placeholder="Your name" />
                <label style={label}>Goals (comma separated)</label>
                <input style={input} value={settingsGoals} onChange={e => setSettingsGoals(e.target.value)} placeholder="find remote jobs, grow audience..." />
                <label style={label}>Keywords (comma separated)</label>
                <input style={input} value={settingsKeywords} onChange={e => setSettingsKeywords(e.target.value)} placeholder="AI agents, solidity, bug bounty..." />
                <label style={label}>Custom subreddits (comma separated)</label>
                <input style={input} value={settingsSubreddits} onChange={e => setSettingsSubreddits(e.target.value)} placeholder="web3, netsec, defi..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button style={saveBtn} onClick={saveProfile}>SAVE PROFILE</button>
                  {saveMsg && <span style={{ fontSize: '12px', color: saveMsg === 'Saved!' ? c.success : c.danger }}>{saveMsg}</span>}
                </div>
              </div>
              <div style={card}>
                <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginBottom: '1.5rem' }}>Agent config</div>
                <label style={label}>Run schedule</label>
                <input style={input} defaultValue="Every day at 5:00 AM UTC" disabled />
                <label style={label}>Account</label>
                <div style={{ fontSize: '12px', color: c.muted, marginBottom: '1.5rem', wordBreak: 'break-all' }}>{user?.email}</div>
                <label style={label}>Sources active</label>
                {['NewsAPI', 'Reddit', 'GitHub', 'Jobs (Remotive)', 'Hacker News', 'Crypto (CoinDesk/Decrypt)', 'Bug Bounty (Immunefi)'].map(src => (
                  <div key={src} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${c.border}` }}>
                    <span style={{ fontSize: '12px', color: c.text }}>{src}</span>
                    <span style={{ fontSize: '10px', color: c.success }}>● ACTIVE</span>
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
