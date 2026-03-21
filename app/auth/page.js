'use client'

import { useState } from 'react'
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

  const dark = true

  const colors = {
    bg: '#080c12',
    surface: '#0e1420',
    border: '#1e2d45',
    accent: '#00e5ff',
    text: '#e2eaf7',
    textMuted: '#4a6080',
  }

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
      else setMessage('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const inputStyle = {
    width: '100%',
    background: '#0e1420',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    padding: '12px 14px',
    color: colors.text,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '12px',
  }

  const btnStyle = {
    width: '100%',
    padding: '12px',
    background: colors.accent,
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
    marginBottom: '10px',
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: colors.accent, letterSpacing: '0.2em', marginBottom: '8px' }}>⬡ DISPATCH</div>
          <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.1em' }}>YOUR AUTONOMOUS INTELLIGENCE AGENT</div>
        </div>

        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '8px', fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'inherit',
                background: mode === m ? `${colors.accent}18` : 'transparent',
                color: mode === m ? colors.accent : colors.textMuted,
                border: mode === m ? `1px solid ${colors.accent}40` : `1px solid ${colors.border}`,
                borderRadius: '4px', cursor: 'pointer',
              }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {message && (
            <div style={{ fontSize: '12px', color: message.includes('Check') ? '#10b981' : '#ef4444', marginBottom: '12px', lineHeight: 1.5 }}>
              {message}
            </div>
          )}

          <button style={btnStyle} onClick={handleSubmit} disabled={loading}>
            {loading ? 'LOADING...' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '11px', color: colors.textMuted, margin: '12px 0', letterSpacing: '0.1em' }}>OR</div>

          <button onClick={handleGoogle} style={{ ...btnStyle, background: 'transparent', color: colors.text, border: `1px solid ${colors.border}`, marginBottom: 0 }}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}