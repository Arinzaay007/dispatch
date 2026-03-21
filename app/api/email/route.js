import { Resend } from 'resend'
import supabase from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, auth.users!inner(email)')

  for (const profile of profiles || []) {
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

          <h2 style="font-size: 22px; color: #e2eaf7; font-weight: 700; margin: 0 0 8px;">
            Good morning, ${profile.name || 'Agent'}.
          </h2>
          <p style="font-size: 12px; color: #4a6080; margin: 0 0 32px;">
            Dispatch scanned ${briefing?.signal_count || signals.length} signals overnight. Here are your top picks.
          </p>

          <div style="background: #0e1420; border: 1px solid #1e2d45; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 10px; color: #4a6080; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 16px;">Top Signals</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${signalRows}
            </table>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 32px;">
            <div style="background: #0e1420; border: 1px solid #1e2d45; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #00e5ff; margin: 0 0 4px;">${briefing?.signal_count || 0}</p>
              <p style="font-size: 10px; color: #4a6080; margin: 0; letter-spacing: 0.1em;">SIGNALS</p>
            </div>
            <div style="background: #0e1420; border: 1px solid #1e2d45; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #10b981; margin: 0 0 4px;">${briefing?.action_count || 0}</p>
              <p style="font-size: 10px; color: #4a6080; margin: 0; letter-spacing: 0.1em;">ACTIONS</p>
            </div>
            <div style="background: #0e1420; border: 1px solid #1e2d45; border-radius: 8px; padding: 16px; flex: 1; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #ef4444; margin: 0 0 4px;">${briefing?.review_count || 0}</p>
              <p style="font-size: 10px; color: #4a6080; margin: 0; letter-spacing: 0.1em;">REVIEW</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://dispatch-psi.vercel.app" style="display: inline-block; padding: 12px 32px; background: #00e5ff; color: #000; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-decoration: none; border-radius: 6px;">VIEW FULL BRIEF ↗</a>
          </div>

          <p style="font-size: 10px; color: #2a3f5c; text-align: center; letter-spacing: 0.05em;">
            Dispatch · Your autonomous intelligence agent
          </p>
        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from: 'Dispatch <onboarding@resend.dev>',
      to: profile['auth.users'].email,
      subject: `⬡ Dispatch Brief — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
      html,
    })
  }

  return Response.json({ ok: true, sent: profiles?.length || 0 })
}