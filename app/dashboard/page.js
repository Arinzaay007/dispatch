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
  const [settingsName, setSettingsName] = useState('')
  const [settingsGoals, setSettingsGoals] = useState('')
  const [settingsKeywords, setSettingsKeywords] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  const dark = theme === 'dark'

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        window.location.href = '/auth'
        return
      }

      const { data: sigs } = await supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      const { data: brief } = await supabase
        .from('briefings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setSignals(sigs || [])
      setBriefing(brief || null)
      setProfile(prof || null)
      setSettingsName(prof?.name || '')
      setSettingsGoals(prof?.goals?.join(', ') || '')
      setSettingsKeywords(prof?.keywords?.join(', ') || '')
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    if (!user) return
    const goals = settingsGoals.split(',').map(s => s.trim()).filter(Boolean)
    const keywords = settingsKeywords.split(',').map(s => s.trim()).filter(Boolean)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name: settingsName, goals, keywords })
    if (error) setSaveMsg('Error saving. Try again.')
    else setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const drafts = signals.filter(s => s.draft)
  const jobs = signals.filter(s => s.source === 'jobs')
  const filtered = filter === 'all' ? signals : signals.filter(s => s.source === filter)
  const reviewCount = signals.filter(s => s.needs_review).length
  const highCount = signals.filter(s => s.score === 'high').length

  const colors = {
    bg: dark ? '#080c12' : '#f0f2f5',
    surface: dark ? '#0e1420' : '#ffffff',
    surface2: dark ? '#141c2e' : '#f8f9fc',
    border: dark ? '#1e2d45' : '#e2e8f0',
    accent: '#00e5ff',
    accent2: '#7c3aed',
    text: dark ? '#e2eaf7' : '#0f172a',
    textMuted: dark ? '#4a6080' : '#64748b',
    high: dark ? '#00e5ff' : '#0891b2',
    med: dark ? '#f59e0b' : '#d97706',
    low: dark ? '#2a3f5c' : '#94a3b8',
    success: '#10b981',
    danger: '#ef4444',
  }

  const scoreColor = s => s === 'high' ? colors.high : s === 'medium' ? colors.med : colors.low
  const scoreBg = (s) => {
    if (s === 'high') return dark ? '#00e5ff18' : '#e0f9ff'
    if (s === 'medium') return dark ? '#f59e0b18' : '#fef3c7'
    return dark ? '#1e2d4520' : '#f1f5f9'
  }

  const styles = {
    page: { minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'IBM Plex Mono', 'Courier New', monospace", transition: 'all 0.3s ease' },
    topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '56px', borderBottom: `1px solid ${colors.border}`, background: colors.surface, position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontSize: '14px', fontWeight: 700, letterSpacing: '0.2em', color: colors.accent, textTransform: 'uppercase' },
    nav: { display: 'flex', gap: '2px' },
    navBtn: (a) => ({ padding: '6px 14px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: active === a ? `${colors.accent}18` : 'transparent', color: active === a ? colors.accent : colors.textMuted, border: active === a ? `1px solid ${colors.accent}40` : '1px solid transparent', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }),
    themeBtn: { fontSize: '11px', padding: '5px 12px', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.textMuted, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.1em' },
    main: { maxWidth: '1400px', margin: '0 auto', padding: '2rem' },
    sectionTitle: { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.accent, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' },
    card: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '1.5rem' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '2rem' },
    stat: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' },
    statNum: (c) => ({ fontSize: '32px', fontWeight: 700, color: c, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '6px' }),
    statLbl: { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' },
    signalItem: { padding: '14px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' },
    tag: (s) => ({ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: scoreBg(s), color: scoreColor(s), fontWeight: 700 }),
    sourceTag: { fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.textMuted, background: dark ? '#1e2d45' : '#f1f5f9', padding: '2px 7px', borderRadius: '3px' },
    logItem: { display: 'flex', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${colors.border}`, alignItems: 'flex-start' },
    logTime: { fontSize: '10px', color: colors.accent, fontFamily: 'inherit', minWidth: '40px', marginTop: '2px' },
    input: { width: '100%', background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '10px 14px', color: colors.text, fontFamily: 'inherit', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' },
    label: { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '6px', display: 'block' },
    saveBtn: { padding: '10px 24px', background: colors.accent, color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
    pill: (a) => ({ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '3px', border: `1px solid ${a ? colors.accent : colors.border}`, background: a ? `${colors.accent}15` : 'transparent', color: a ? colors.accent : colors.textMuted, cursor: 'pointer', fontFamily: 'inherit' }),
  }

  const accentLine = { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})` }

  if (loading) return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', letterSpacing: '0.2em', color: colors.accent }}>
      DISPATCH // LOADING INTELLIGENCE...
    </div>
  )

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <div style={styles.topbar}>
        <div style={styles.logo}>⬡ DISPATCH</div>
        <nav style={styles.nav}>
          {NAV.map(n => <button key={n} style={styles.navBtn(n)} onClick={() => setActive(n)}>{n}</button>)}
        </nav>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={styles.themeBtn} onClick={() => setTheme(dark ? 'light' : 'dark')}>{dark ? '◑ LIGHT' : '◐ DARK'}</button>
          <button style={{ ...styles.themeBtn, color: colors.danger, borderColor: colors.danger + '40' }} onClick={signOut}>SIGN OUT</button>
        </div>
      </div>
      <div style={styles.main}>

        {active === 'Brief' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Morning Brief<span style={{ marginLeft: 'auto', fontSize: '10px', color: colors.textMuted }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span></div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>Good morning, {profile?.name || user?.email?.split('@')[0] || 'Agent'}.</div>
              <div style={{ fontSize: '12px', color: colors.textMuted }}>Dispatch ran overnight. Here's your intelligence summary.</div>
            </div>
            <div style={styles.statGrid}>
              {[
                { num: briefing?.signal_count || signals.length, label: 'Signals scanned', color: colors.text },
                { num: highCount, label: 'High relevance', color: colors.high },
                { num: briefing?.action_count || 0, label: 'Actions taken', color: colors.success },
                { num: reviewCount, label: 'Need review', color: colors.danger },
              ].map((s, i) => (
                <div key={i} style={styles.stat}>
                  <div style={accentLine} />
                  <div style={styles.statNum(s.color)}>{s.num}</div>
                  <div style={styles.statLbl}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={styles.grid2}>
              <div style={styles.card}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>Top signals</div>
                {signals.filter(s => s.score === 'high').slice(0, 6).map((s, i) => (
                  <div key={i} style={styles.signalItem}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}><span style={styles.sourceTag}>{s.source}</span><span style={styles.tag(s.score)}>{s.score}</span></div>
                    <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>{s.action_taken}</div>
                  </div>
                ))}
                {signals.filter(s => s.score === 'high').length === 0 && <div style={{ fontSize: '12px', color: colors.textMuted, padding: '2rem 0', textAlign: 'center' }}>No high-relevance signals yet.</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={styles.card}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>Needs attention</div>
                  {signals.filter(s => s.needs_review).slice(0, 4).map((s, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: '10px' }}>
                      <span style={{ color: colors.danger }}>▲</span>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.text, lineHeight: 1.4 }}>{s.title?.slice(0, 60)}...</div>
                        <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: '3px' }}>{s.source} · {s.action_taken}</div>
                      </div>
                    </div>
                  ))}
                  {signals.filter(s => s.needs_review).length === 0 && <div style={{ fontSize: '12px', color: colors.textMuted }}>Nothing needs your attention.</div>}
                </div>
                <div style={styles.card}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>Source breakdown</div>
                  {['newsapi', 'reddit', 'github', 'jobs'].map(src => {
                    const count = signals.filter(s => s.source === src).length
                    const pct = signals.length ? Math.round((count / signals.length) * 100) : 0
                    return (
                      <div key={src} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '10px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{src}</span>
                          <span style={{ fontSize: '10px', color: colors.text }}>{count}</span>
                        </div>
                        <div style={{ height: '3px', background: colors.border, borderRadius: '2px' }}>
                          <div style={{ height: '3px', width: `${pct}%`, background: colors.accent, borderRadius: '2px' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'Signals' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Signal Feed</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['all', 'newsapi', 'reddit', 'github', 'jobs', 'hackernews', 'producthunt', 'indiehackers'].map(f => <button key={f} style={styles.pill(filter === f)} onClick={() => setFilter(f)}>{f}</button>)}
            </div>
            <div style={styles.card}>
              {filtered.map((s, i) => (
                <div key={i} style={{ ...styles.signalItem, background: i % 2 === 0 ? 'transparent' : (dark ? '#ffffff04' : '#00000003') }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={styles.sourceTag}>{s.source}</span>
                    <span style={styles.tag(s.score)}>{s.score}</span>
                    {s.needs_review && <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: dark ? '#ef444418' : '#fee2e2', color: colors.danger, fontWeight: 700 }}>review</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5, marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: colors.textMuted }}>{s.action_taken}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: colors.accent, textDecoration: 'none' }}>OPEN ↗</a>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '12px', color: colors.textMuted }}>No signals found.</div>}
            </div>
          </div>
        )}

        {active === 'Drafts' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Drafts Ready for Review</div>
            {drafts.length === 0 ? (
              <div style={{ ...styles.card, textAlign: 'center', padding: '3rem', color: colors.textMuted, fontSize: '12px' }}>No drafts yet. Run the agent to generate content drafts.</div>
            ) : drafts.map((s, i) => (
              <div key={i} style={{ ...styles.card, borderLeft: `3px solid ${colors.accent}`, marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                  <span style={styles.sourceTag}>{s.source}</span>
                  <span style={styles.tag(s.score)}>{s.score}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: colors.textMuted }}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '8px' }}>Signal: {s.title}</div>
                <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.7, background: dark ? '#ffffff06' : '#00000006', padding: '14px', borderRadius: '6px' }}>{s.draft}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button style={{ ...styles.saveBtn, background: colors.success }}>✓ APPROVE</button>
                  <button style={{ ...styles.saveBtn, background: 'transparent', color: colors.textMuted, border: `1px solid ${colors.border}` }}>✕ DISCARD</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === 'Jobs' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Job Applications</div>
            {jobs.length === 0 ? (
              <div style={{ ...styles.card, textAlign: 'center', padding: '3rem', color: colors.textMuted, fontSize: '12px' }}>No job listings found yet.</div>
            ) : jobs.map((s, i) => (
              <div key={i} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: colors.text, fontWeight: 700, marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontSize: '11px', color: colors.textMuted, lineHeight: 1.6 }}>{s.summary?.slice(0, 180)}...</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span style={styles.tag(s.score)}>{s.score} match</span>
                  </div>
                </div>
                {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ ...styles.saveBtn, textDecoration: 'none', display: 'block', textAlign: 'center', flexShrink: 0 }}>VIEW ↗</a>}
              </div>
            ))}
          </div>
        )}

        {active === 'Log' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Agent Activity Log</div>
            <div style={styles.card}>
              {signals.slice(0, 50).map((s, i) => (
                <div key={i} style={styles.logItem}>
                  <span style={styles.logTime}>{new Date(s.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: colors.text, lineHeight: 1.5 }}>
                      <span style={{ color: scoreColor(s.score) }}>[{s.score?.toUpperCase()}]</span>{' '}{s.action_taken} — {s.title?.slice(0, 70)}{s.title?.length > 70 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: '10px', color: colors.textMuted, marginTop: '2px' }}>source: {s.source}</div>
                  </div>
                </div>
              ))}
              {signals.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', fontSize: '12px', color: colors.textMuted }}>No activity yet.</div>}
            </div>
          </div>
        )}

        {active === 'Settings' && (
          <div>
            <div style={styles.sectionTitle}><span>◈</span> Settings</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={styles.card}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1.5rem' }}>Profile</div>
                <label style={styles.label}>Name</label>
                <input style={styles.input} value={settingsName} onChange={e => setSettingsName(e.target.value)} placeholder="Your name" />
                <label style={styles.label}>Goals (comma separated)</label>
                <input style={styles.input} value={settingsGoals} onChange={e => setSettingsGoals(e.target.value)} placeholder="find remote jobs, grow audience..." />
                <label style={styles.label}>Keywords (comma separated)</label>
                <input style={styles.input} value={settingsKeywords} onChange={e => setSettingsKeywords(e.target.value)} placeholder="AI agents, solidity, bug bounty..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button style={styles.saveBtn} onClick={saveProfile}>SAVE PROFILE</button>
                  {saveMsg && <span style={{ fontSize: '12px', color: saveMsg === 'Saved!' ? colors.success : colors.danger }}>{saveMsg}</span>}
                </div>
              </div>
              <div style={styles.card}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1.5rem' }}>Agent config</div>
                <label style={styles.label}>Run schedule</label>
                <input style={styles.input} defaultValue="Every day at 5:00 AM UTC" disabled />
                <label style={styles.label}>Account</label>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '1.5rem' }}>{user?.email}</div>
                <label style={styles.label}>Sources active</label>
                {['NewsAPI', 'Reddit', 'GitHub', 'Jobs (Remotive)'].map(src => (
                  <div key={src} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ fontSize: '12px', color: colors.text }}>{src}</span>
                    <span style={{ fontSize: '10px', color: colors.success, letterSpacing: '0.1em' }}>● ACTIVE</span>
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
