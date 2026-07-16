import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('get_event_revenue_summary', { target_event_id: eventId })

  if (error) {
    console.error('Error fetching stats:', error)
    return null
  }

  // 'data' will be an array containing one object:
  // { total_gross, total_net, ticket_count }
  return data[0]
}
