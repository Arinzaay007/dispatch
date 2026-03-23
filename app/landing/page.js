'use client'

import { useState, useEffect } from 'react'

const SIGNALS = [
  { source: 'github', score: 'high', title: 'browser-use/browser-use — 3.2k stars this week', action: 'drafted post' },
  { source: 'newsapi', score: 'high', title: 'Groq announces 10x faster inference for LLMs', action: 'drafted thread' },
  { source: 'reddit', score: 'high', title: 'AI agents are replacing traditional automation tools', action: 'bookmarked' },
  { source: 'jobs', score: 'medium', title: 'Senior Smart Contract Auditor — Remote · $120k', action: 'application drafted' },
  { source: 'hackernews', score: 'high', title: 'Show HN: I built an autonomous research agent', action: 'flagged for review' },
  { source: 'crypto', score: 'medium', title: 'Mistral releases Small 4 — fastest open model yet', action: 'bookmarked' },
]

const FEATURES = [
  { icon: '◈', label: 'MONITOR', title: '7 Intel Sources', desc: 'News, Reddit, GitHub, Jobs, Hacker News, Crypto, Bug Bounties — unified into one feed.' },
  { icon: '▲', label: 'ANALYZE', title: 'AI Scoring Engine', desc: 'Groq LLM scores each signal by relevance to your goals. High, medium, or low priority.' },
  { icon: '✓', label: 'EXECUTE', title: 'Autonomous Actions', desc: 'Drafts posts, writes applications, flags bounties — all while you sleep.' },
  { icon: '⬡', label: 'REPORT', title: 'Morning Brief', desc: 'Wake up to a command dashboard and email digest with everything ready for your review.' },
]

export default function Landing() {
  const [tick, setTick] = useState(0)
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timeTick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    timeTick()
    const t1 = setInterval(timeTick, 1000)
    const t2 = setInterval(() => setTick(t => (t + 1) % SIGNALS.length), 2500)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  const scoreColor = s => s === 'high' ? '#f97316' : '#eab308'
  const scoreBg = s => s === 'high' ? 'rgba(249,115,22,0.12)' : 'rgba(234,179,8,0.12)'

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e8ddd0', fontFamily: "'Share Tech Mono', monospace", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 1px rgba(249,115,22,0.1); } 50% { box-shadow: 0 0 20px rgba(249,115,22,0.15); } }
        .fade-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-2 { animation: fadeUp 0.6s ease 0.2s both; }
        .fade-3 { animation: fadeUp 0.6s ease 0.3s both; }
        .fade-4 { animation: fadeUp 0.6s ease 0.4s both; }
        .fade-5 { animation: fadeUp 0.6s ease 0.5s both; }
        .cta-primary:hover { background: #fb923c !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.3) !important; }
        .cta-secondary:hover { border-color: #f97316 !important; color: #f97316 !important; }
        .feature-card:hover { border-color: rgba(249,115,22,0.4) !important; background: rgba(249,115,22,0.03) !important; }
        .feature-card:hover .feature-icon { color: #f97316 !important; }
        .nav-link:hover { color: #f97316 !important; }
        .signal-feed { animation: glowPulse 4s ease infinite; }
      `}</style>

      {/* Fixed background effects */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(#0f1419 1px, transparent 1px), linear-gradient(90deg, #0f1419 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.06), transparent)', animation: 'scanline 8s linear infinite' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '52px', borderBottom: '1px solid #1a2535', background: 'rgba(8,10,15,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', fontWeight: 900, background: 'linear-gradient(90deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.2em' }}>DISPATCH</div>
          <div style={{ fontSize: '8px', color: 'rgba(249,115,22,0.4)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite', display: 'inline-block' }} />
            SYS ONLINE
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" className="nav-link" style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#4a5568', textDecoration: 'none', transition: 'color 0.15s', textTransform: 'uppercase' }}>FEATURES</a>
          <a href="#how" className="nav-link" style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#4a5568', textDecoration: 'none', transition: 'color 0.15s', textTransform: 'uppercase' }}>PROTOCOL</a>
          <a href="/auth" style={{ fontSize: '9px', letterSpacing: '0.15em', padding: '6px 14px', border: '1px solid rgba(249,115,22,0.4)', borderRadius: '3px', color: '#f97316', textDecoration: 'none', transition: 'all 0.15s', textTransform: 'uppercase' }}>ACCESS</a>
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(249,115,22,0.4)', letterSpacing: '0.15em', fontFamily: "'Orbitron', monospace" }}>{time}</div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem 2rem' }}>
        <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
          <div className="fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '9px', letterSpacing: '0.2em', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '2px', padding: '6px 16px', marginBottom: '2rem', textTransform: 'uppercase' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f97316', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            AGENT ACTIVE // 7 SOURCES MONITORED // REAL-TIME
          </div>

          <h1 className="fade-2" style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(32px, 7vw, 72px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 1.5rem', letterSpacing: '-0.01em' }}>
            YOUR AUTONOMOUS<br />
            <span style={{ background: 'linear-gradient(90deg, #f97316, #fb923c, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>INTELLIGENCE AGENT.</span>
          </h1>

          <p className="fade-3" style={{ fontSize: '14px', color: '#4a5568', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
            Dispatch monitors the web while you sleep — scoring signals, drafting posts, writing job applications — and delivers your brief every morning at 06:00.
          </p>

          <div className="fade-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth" className="cta-primary" style={{ display: 'inline-block', padding: '13px 32px', background: '#f97316', color: '#000', fontWeight: 700, fontSize: '11px', letterSpacing: '0.2em', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s', fontFamily: "'Orbitron', monospace", textTransform: 'uppercase' }}>
              DEPLOY AGENT ↗
            </a>
            <a href="#how" className="cta-secondary" style={{ display: 'inline-block', padding: '13px 32px', background: 'transparent', color: '#e8ddd0', fontWeight: 400, fontSize: '11px', letterSpacing: '0.15em', textDecoration: 'none', borderRadius: '3px', border: '1px solid #1a2535', fontFamily: 'inherit', transition: 'all 0.2s', textTransform: 'uppercase' }}>
              VIEW PROTOCOL
            </a>
          </div>

          {/* Live signal feed */}
          <div className="fade-5 signal-feed" style={{ marginTop: '4rem', background: 'rgba(13,17,23,0.98)', border: '1px solid #1a2535', borderRadius: '4px', padding: '1.5rem', textAlign: 'left', maxWidth: '600px', margin: '4rem auto 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid #f97316', borderLeft: '2px solid #f97316' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid #f97316', borderRight: '2px solid #f97316' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a5568', textTransform: 'uppercase' }}>LIVE INTEL FEED // AGENT PROCESSING</span>
            </div>
            {SIGNALS.slice(tick, tick + 3).concat(SIGNALS.slice(0, Math.max(0, tick + 3 - SIGNALS.length))).map((s, i) => (
              <div key={`${tick}-${i}`} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid #1a2535' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.5 : 0.25, transition: 'opacity 0.5s' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
                  <span style={{ fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f97316', background: 'rgba(249,115,22,0.12)', padding: '2px 6px', borderRadius: '2px', border: '1px solid rgba(249,115,22,0.2)' }}>{s.source}</span>
                  <span style={{ fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: scoreColor(s.score), background: scoreBg(s.score), padding: '2px 6px', borderRadius: '2px', fontWeight: 700 }}>{s.score}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#e8ddd0', lineHeight: 1.4, marginBottom: '3px' }}>{s.title}</div>
                <div style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '0.05em' }}>AGENT ACTION: {s.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ position: 'relative', zIndex: 1, padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.25em', color: '#f97316', marginBottom: '1rem', textTransform: 'uppercase' }}>◈ SYSTEM CAPABILITIES</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>
            BUILT TO OPERATE<br /><span style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WHILE YOU REST.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid #1a2535', borderRadius: '4px', padding: '1.5rem', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: '2px solid rgba(249,115,22,0.4)', borderLeft: '2px solid rgba(249,115,22,0.4)' }} />
              <div style={{ fontSize: '8px', color: '#f97316', letterSpacing: '0.2em', marginBottom: '8px', textTransform: 'uppercase' }}>{f.label}</div>
              <div className="feature-icon" style={{ fontSize: '18px', color: 'rgba(249,115,22,0.6)', marginBottom: '10px', transition: 'color 0.2s' }}>{f.icon}</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 700, color: '#e8ddd0', marginBottom: '8px', letterSpacing: '0.05em' }}>{f.title}</div>
              <div style={{ fontSize: '11px', color: '#4a5568', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol */}
      <div id="how" style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem 6rem', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.25em', color: '#f97316', marginBottom: '1rem', textTransform: 'uppercase' }}>◉ OPERATIONAL PROTOCOL</div>
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 900, margin: 0 }}>
            THE AUTONOMOUS<br /><span style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LOOP.</span>
          </h2>
        </div>
        {[
          { step: '01', title: 'CONFIGURE YOUR OBJECTIVES', desc: 'Set your goals, keywords, and intel sources. Takes 2 minutes.' },
          { step: '02', title: 'AGENT DEPLOYS AT 05:00 UTC', desc: 'Scans 7 sources, scores every signal, drafts posts and applications autonomously.' },
          { step: '03', title: 'RECEIVE MORNING BRIEF', desc: 'Dashboard + email digest waiting for you. Full picture in seconds.' },
          { step: '04', title: 'REVIEW AND EXECUTE', desc: 'Approve drafts, apply to jobs, act on opportunities. One click.' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '20px', padding: '1.75rem 0', borderBottom: i < 3 ? '1px solid #1a2535' : 'none', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '10px', fontWeight: 700, color: 'rgba(249,115,22,0.4)', minWidth: '28px', marginTop: '2px' }}>{s.step}</div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(249,115,22,0.3), transparent)', marginTop: '10px', maxWidth: '20px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 700, color: '#e8ddd0', marginBottom: '6px', letterSpacing: '0.05em' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: '#4a5568', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid #1a2535' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.25em', color: '#f97316', marginBottom: '1.5rem', textTransform: 'uppercase' }}>⬡ DEPLOY YOUR AGENT</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
          AGENT STANDING BY.<br /><span style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AWAITING ORDERS.</span>
        </h2>
        <div style={{ fontSize: '12px', color: '#4a5568', marginBottom: '2.5rem' }}>Free to deploy. No credit card required.</div>
        <a href="/auth" className="cta-primary" style={{ display: 'inline-block', padding: '14px 40px', background: '#f97316', color: '#000', fontWeight: 700, fontSize: '11px', letterSpacing: '0.2em', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s', fontFamily: "'Orbitron', monospace", textTransform: 'uppercase' }}>
          DEPLOY DISPATCH ↗
        </a>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem 2rem', borderTop: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 900, background: 'linear-gradient(90deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.15em' }}>DISPATCH</div>
        <div style={{ fontSize: '9px', color: 'rgba(249,115,22,0.25)', letterSpacing: '0.1em' }}>AUTONOMOUS INTELLIGENCE NETWORK // SECURE</div>
      </div>
    </div>
  )
}
