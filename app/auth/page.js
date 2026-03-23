'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  async function handleSubmit() {
    setLoading(true)
    setMessage('')
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/onboarding'
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono', monospace", padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-border { 0%, 100% { box-shadow: 0 0 0 1px rgba(249,115,22,0.1); } 50% { box-shadow: 0 0 20px rgba(249,115,22,0.15); } }
        .auth-card { animation: fadeUp 0.5s ease forwards, pulse-border 4s ease infinite; }
        .auth-input:focus { border-color: #f97316 !important; box-shadow: 0 0 0 2px rgba(249,115,22,0.15) !important; }
        .auth-btn:hover { background: #fb923c !important; transform: translateY(-1px); }
        .mode-btn:hover { color: #f97316 !important; }
      `}</style>

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(#0f1419 1px, transparent 1px), linear-gradient(90deg, #0f1419 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6, pointerEvents: 'none' }} />

      {/* Scanline */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.08), transparent)', animation: 'scanline 6s linear infinite' }} />
      </div>

      {/* Corner decorations */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', width: '40px', height: '40px', borderTop: '2px solid rgba(249,115,22,0.3)', borderLeft: '2px solid rgba(249,115,22,0.3)' }} />
      <div style={{ position: 'fixed', top: '20px', right: '20px', width: '40px', height: '40px', borderTop: '2px solid rgba(249,115,22,0.3)', borderRight: '2px solid rgba(249,115,22,0.3)' }} />
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', width: '40px', height: '40px', borderBottom: '2px solid rgba(249,115,22,0.3)', borderLeft: '2px solid rgba(249,115,22,0.3)' }} />
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '2px solid rgba(249,115,22,0.3)', borderRight: '2px solid rgba(249,115,22,0.3)' }} />

      {/* Clock */}
      <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'rgba(249,115,22,0.5)', letterSpacing: '0.2em', fontFamily: "'Orbitron', monospace" }}>{time}</div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '24px', fontWeight: 900, background: 'linear-gradient(90deg, #f97316, #fb923c, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.3em', marginBottom: '8px' }}>DISPATCH</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '9px', color: 'rgba(249,115,22,0.6)', letterSpacing: '0.2em' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite', display: 'inline-block' }} />
            AUTONOMOUS INTELLIGENCE SYSTEM // ONLINE
          </div>
        </div>

        {/* Card */}
        <div className="auth-card" style={{ background: 'rgba(13,17,23,0.98)', border: '1px solid #1a2535', borderRadius: '4px', padding: '2rem', position: 'relative' }}>
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: '2px solid #f97316', borderLeft: '2px solid #f97316' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: '2px solid #f97316', borderRight: '2px solid #f97316' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: '2px solid #f97316', borderLeft: '2px solid #f97316' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: '2px solid #f97316', borderRight: '2px solid #f97316' }} />

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '1.75rem', background: '#131920', padding: '4px', borderRadius: '3px' }}>
            {['signin', 'signup'].map(m => (
              <button key={m} className="mode-btn" onClick={() => { setMode(m); setMessage('') }} style={{
                flex: 1, padding: '8px', fontSize: '10px', letterSpacing: '0.15em',
                textTransform: 'uppercase', fontFamily: 'inherit',
                background: mode === m ? '#f97316' : 'transparent',
                color: mode === m ? '#000' : 'rgba(249,115,22,0.5)',
                border: 'none', borderRadius: '2px', cursor: 'pointer',
                fontWeight: mode === m ? 700 : 400, transition: 'all 0.15s',
              }}>
                {m === 'signin' ? 'AUTHENTICATE' : 'REGISTER'}
              </button>
            ))}
          </div>

          {/* Status line */}
          <div style={{ fontSize: '9px', color: 'rgba(249,115,22,0.4)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            {mode === 'signin' ? '// ENTER CREDENTIALS TO ACCESS SYSTEM' : '// CREATE NEW OPERATOR ACCOUNT'}
          </div>

          {/* Inputs */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.5)', marginBottom: '5px', display: 'block' }}>OPERATOR ID (EMAIL)</label>
            <input
              className="auth-input"
              type="email"
              placeholder="agent@dispatch.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: '#131920', border: '1px solid #1a2535', borderRadius: '3px', padding: '11px 14px', color: '#e8ddd0', fontFamily: 'inherit', fontSize: '12px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s', letterSpacing: '0.05em' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.5)', marginBottom: '5px', display: 'block' }}>ACCESS KEY (PASSWORD)</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: '#131920', border: '1px solid #1a2535', borderRadius: '3px', padding: '11px 14px', color: '#e8ddd0', fontFamily: 'inherit', fontSize: '12px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s', letterSpacing: '0.1em' }}
            />
          </div>

          {message && (
            <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '1rem', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '3px', letterSpacing: '0.03em' }}>
              ⚠ {message}
            </div>
          )}

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#f97316', color: '#000', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Orbitron', monospace", transition: 'all 0.15s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'AUTHENTICATING...' : mode === 'signin' ? 'ACCESS SYSTEM ↗' : 'DEPLOY AGENT ↗'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '9px', color: 'rgba(249,115,22,0.25)', letterSpacing: '0.15em' }}>
          DISPATCH // AUTONOMOUS INTELLIGENCE NETWORK // SECURE
        </div>
      </div>
    </div>
  )
}
