import { runDispatch } from '@/lib/runner'
import supabase from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const secret = req.headers.get('authorization')

  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')

  if (error) {
    return Response.json({ error: 'Failed to load profiles' }, { status: 500 })
  }

  for (const profile of profiles || []) {
    await runDispatch(profile.id)
  }

  return Response.json({ ok: true, ran: profiles?.length || 0 })
}