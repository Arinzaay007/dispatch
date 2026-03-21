'use client'

import { useState, useEffect } from 'react'

const SIGNALS = [
  { source: 'github', score: 'high', title: 'browser-use/browser-use — 3.2k stars this week', action: 'drafted post' },
  { source: 'newsapi', score: 'high', title: 'Groq announces 10x faster inference for LLMs', action: 'drafted thread' },
  { source: 'reddit', score: 'high', title: 'AI agents are replacing traditional automation tools', action: 'bookmarked' },
  { source: 'jobs', score: 'medium', title: 'Senior Smart Contract Auditor — Remote · $120k', action: 'application drafted' },
  { source: 'hackernews', score: 'high', title: 'Show HN: I built an autonomous research agent', action: 'flagged for review' },
  { source: 'producthunt', score: 'medium', title: 'Dispatch — Your autonomous intelligence agent', action: 'bookmarked' },
]

const FEATURES = [
  { icon: '◈', title: 'Monitors 7 sources', desc: 'News, Reddit, GitHub, Jobs, Hacker News, Product Hunt, Indie Hackers — all unified into one intelligent feed.' },
  { icon: '◉', title: 'AI brain scores everything', desc: 'Groq-powered LLM scores each signal by relevance to your goals and keywords. High, medium, or low.' },
  { icon: '◎', title: 'Acts autonomously', desc: 'Drafts posts, writes job applications, flags bounties — all while you sleep.' },
  { icon: '⬡', title: 'Morning brief', desc: 'Wake up to a clean dashboard and email digest. See what happened, what was done, what needs you.' },
]

export default function Landing() {
  const [tick, setTick] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => setTick(t => (t + 1) % SIGNALS.length), 2000)
    return () => clearInterval(interval)
  }, [])

  const scoreColor = s => s === 'high' ? '#00e5ff' : '#f59e0b'
  const scoreBg = s => s === 'high' ? '#00e5ff15' : '#f59e0b15'

  return (
    <div style={{ minHeight: '100vh', background: '#060a10', color: '#e2eaf7', fontFamily: "'IBM Plex Mono', monospace", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .cta-btn:hover { background: #00e5ff !important; transform: translateY(-2px); }
        .feature-card:hover { border-color: #00e5ff40 !important; background: #0e1420 !important; }
        .nav-link:hover { color: #00e5ff !important; }
      `}</style>

      {/* Scan line effect */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #00e5ff10, transparent)', animation: 'scan 8s linear infinite' }} />
      </div>

      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(#0e1420 1px, transparent 1px), linear-gradient(90deg, #0e1420 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e2d45', background: '#060a10ee', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.2em', color: '#00e5ff' }}>⬡ DISPATCH</div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" className="nav-link" style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#4a6080', textDecoration: 'none', transition: 'color 0.15s' }}>FEATURES</a>
          <a href="#how" className="nav-link" style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#4a6080', textDecoration: 'none', transition: 'color 0.15s' }}>HOW IT WORKS</a>
          <a href="/auth" style={{ fontSize: '11px', letterSpacing: '0.1em', padding: '6px 16px', border: '1px solid #00e5ff40', borderRadius: '4px', color: '#00e5ff', textDecoration: 'none', transition: 'all 0.15s' }}>SIGN IN</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem 0' }}>
        <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
          <div className="fade-up delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '0.2em', color: '#00e5ff', border: '1px solid #00e5ff30', borderRadius: '20px', padding: '6px 16px', marginBottom: '2rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5ff', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            AGENT ACTIVE · 7 SOURCES MONITORED
          </div>

          <h1 className="fade-up delay-2" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, margin: '0 0 1.5rem', letterSpacing: '-0.02em' }}>
            Your autonomous<br />
            <span style={{ color: '#00e5ff' }}>intelligence agent.</span>
          </h1>

          <p className="fade-up delay-3" style={{ fontSize: '16px', color: '#4a6080', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2.5rem', fontFamily: 'inherit' }}>
            Dispatch monitors the web while you sleep — scoring signals, drafting posts, writing job applications — and briefs you every morning.
          </p>

          <div className="fade-up delay-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth" className="cta-btn" style={{ display: 'inline-block', padding: '14px 32px', background: '#00e5ff', color: '#000', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s', fontFamily: 'inherit' }}>
              START FOR FREE ↗
            </a>
            <a href="#how" style={{ display: 'inline-block', padding: '14px 32px', background: 'transparent', color: '#e2eaf7', fontWeight: 500, fontSize: '12px', letterSpacing: '0.15em', textDecoration: 'none', borderRadius: '6px', border: '1px solid #1e2d45', fontFamily: 'inherit' }}>
              SEE HOW IT WORKS
            </a>
          </div>

          {/* Live feed preview */}
          <div className="fade-up delay-5" style={{ marginTop: '4rem', background: '#0e1420', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', maxWidth: '640px', margin: '4rem auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#4a6080', textTransform: 'uppercase' }}>Live signal feed</span>
            </div>
            {SIGNALS.slice(tick, tick + 3).concat(SIGNALS.slice(0, Math.max(0, tick + 3 - SIGNALS.length))).map((s, i) => (
              <div key={`${tick}-${i}`} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid #1e2d45' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.3, transition: 'opacity 0.5s' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a6080', background: '#1e2d45', padding: '2px 6px', borderRadius: '2px' }}>{s.source}</span>
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: scoreColor(s.score), background: scoreBg(s.score), padding: '2px 6px', borderRadius: '2px', fontWeight: 700 }}>{s.score}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#e2eaf7', lineHeight: 1.4, marginBottom: '3px' }}>{s.title}</div>
                <div style={{ fontSize: '10px', color: '#4a6080' }}>Agent: {s.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ position: 'relative', zIndex: 1, padding: '8rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '1rem' }}>◈ FEATURES</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Built to work<br /><span style={{ color: '#00e5ff' }}>while you rest.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ background: '#0a0f18', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.75rem', transition: 'all 0.2s', cursor: 'default' }}>
              <div style={{ fontSize: '20px', color: '#00e5ff', marginBottom: '1rem' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2eaf7', marginBottom: '8px', letterSpacing: '0.05em' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: '#4a6080', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem 8rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '1rem' }}>◉ HOW IT WORKS</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>The autonomous<br /><span style={{ color: '#00e5ff' }}>loop.</span></h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { step: '01', title: 'Set your goals & keywords', desc: 'Tell Dispatch what you care about — skills, interests, job titles, topics.' },
            { step: '02', title: 'Agent runs every night at 5am', desc: 'Scans 7 sources, scores every signal, drafts posts and applications.' },
            { step: '03', title: 'Wake up to your brief', desc: 'Open the dashboard or check your email. Everything is ready.' },
            { step: '04', title: 'Approve, discard, or act', desc: 'Review AI-drafted content. One click to publish or apply.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '24px', padding: '2rem 0', borderBottom: i < 3 ? '1px solid #1e2d45' : 'none' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#00e5ff', opacity: 0.5, minWidth: '32px', marginTop: '2px' }}>{s.step}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2eaf7', marginBottom: '6px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#4a6080', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid #1e2d45' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '1.5rem' }}>⬡ GET STARTED</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 1.5rem', letterSpacing: '-0.02em' }}>
          Your agent is<br /><span style={{ color: '#00e5ff' }}>ready to deploy.</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4a6080', marginBottom: '2.5rem', lineHeight: 1.7 }}>Free to start. No credit card required.</p>
        <a href="/auth" className="cta-btn" style={{ display: 'inline-block', padding: '16px 40px', background: '#00e5ff', color: '#000', fontWeight: 700, fontSize: '13px', letterSpacing: '0.15em', textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s', fontFamily: 'inherit' }}>
          LAUNCH DISPATCH ↗
        </a>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', borderTop: '1px solid #1e2d45', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#00e5ff', letterSpacing: '0.15em' }}>⬡ DISPATCH</div>
        <div style={{ fontSize: '11px', color: '#2a3f5c', letterSpacing: '0.05em' }}>Your autonomous intelligence agent.</div>
      </div>
    </div>
  )
}
