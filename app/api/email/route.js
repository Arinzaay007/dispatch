import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  let sent = 0

  for (const profile of profiles || []) {
    const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
    const email = userData?.user?.email
    if (!email) continue

    const { data: signals } = await supabase
      .from('signals')
      .select('*')
      .eq('user_id', profile.id)
      .eq('score', 'high')
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
        <td style="padding: 12px 0; border-bottom: 1px solid #1e2d45;">
          <span style="font-size: 10px; color: #00e5ff; font-family: monospace; text-transform: uppercase;">${s.source}</span>
          <p style="margin: 6px 0 4px; font-size: 14px; color: #e2eaf7;">${s.title}</p>
          <span style="font-size: 11px; color: #4a6080;">${s.action_taken}</span>
        </td>
      </tr>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="background: #080c12; margin: 0; padding: 40px 20px; font-family: 'Courier New', monospace;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="margin-bottom: 32px;">
            <h1 style="font-size: 14px; color: #00e5ff; letter-spacing: 0.2em; margin: 0 0 8px;">⬡ DISPATCH</h1>
            <p style="font-size: 11px; color: #4a6080; margin: 0; letter-spacing: 0.1em;">YOUR MORNING INTELLIGENCE BRIEF</p>
          </div>
          <h2 style="font-size: 22px; color: #e2eaf7; font-weight: 700; margin: 0 0 8px;">Good morning, ${profile.name || 'Agent'}.</h2>
          <p style="font-size: 12px; color: #4a6080; margin: 0 0 32px;">Dispatch scanned ${briefing?.signal_count || signals.length} signals overnight. Here are your top picks.</p>
          <div style="background: #0e1420; border: 1px solid #1e2d45; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 10px; color: #4a6080; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 16px;">Top Signals</p>
            <table style="width: 100%; border-collapse: collapse;">${signalRows}</table>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://dispatch-psi.vercel.app" style="display: inline-block; padding: 12px 32px; background: #00e5ff; color: #000; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-decoration: none; border-radius: 6px;">VIEW FULL BRIEF ↗</a>
          </div>
          <p style="font-size: 10px; color: #2a3f5c; text-align: center;">Dispatch · Your autonomous intelligence agent</p>
        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from: 'Dispatch <onboarding@resend.dev>',
      to: email,
      subject: `⬡ Dispatch Brief — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
      html,
    })

    sent++
  }

  return Response.json({ ok: true, sent })
}