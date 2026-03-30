import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profiles } = await supabase.from('profiles').select('*')

  let sent = 0

  for (const profile of profiles || []) {
    const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
    const email = userData?.user?.email
    if (!email) continue

    const { data: signals } = await supabase
      .from('signals')
      .select('*')
      .eq('user_id', profile.id)
      .in('score', ['high', 'medium'])
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: briefing } = await supabase
      .from('briefings')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!signals?.length) continue

    const signalRows = signals.map(s => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1a2535;">
          <span style="font-size: 10px; color: #f97316; font-family: monospace; text-transform: uppercase;">${s.source}</span>
          <p style="margin: 6px 0 4px; font-size: 14px; color: #e8ddd0;">${s.title}</p>
          <span style="font-size: 11px; color: #4a5568;">${s.action_taken}</span>
        </td>
      </tr>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="background: #080a0f; margin: 0; padding: 40px 20px; font-family: 'Courier New', monospace;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="margin-bottom: 32px;">
            <h1 style="font-size: 14px; color: #f97316; letter-spacing: 0.2em; margin: 0 0 8px;">DISPATCH</h1>
            <p style="font-size: 11px; color: #4a5568; margin: 0; letter-spacing: 0.1em;">MORNING INTELLIGENCE BRIEF</p>
          </div>
          <h2 style="font-size: 22px; color: #e8ddd0; font-weight: 700; margin: 0 0 8px;">GOOD MORNING, ${(profile.name || 'AGENT').toUpperCase()}.</h2>
          <p style="font-size: 12px; color: #4a5568; margin: 0 0 32px;">Dispatch scanned ${briefing?.signal_count || signals.length} signals overnight. Here are your top picks.</p>
          <div style="background: #0d1117; border: 1px solid #1a2535; border-radius: 4px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 10px; color: #4a5568; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 16px;">// PRIORITY SIGNALS</p>
            <table style="width: 100%; border-collapse: collapse;">${signalRows}</table>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://dispatch-psi.vercel.app" style="display: inline-block; padding: 12px 32px; background: #f97316; color: #000; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-decoration: none; border-radius: 3px;">VIEW FULL BRIEF ↗</a>
          </div>
          <p style="font-size: 10px; color: #1a2535; text-align: center;">DISPATCH // AUTONOMOUS INTELLIGENCE NETWORK</p>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `Dispatch <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `DISPATCH BRIEF // ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}`,
      html,
    })

    sent++
  }

  return Response.json({ ok: true, sent })
}