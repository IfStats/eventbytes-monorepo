import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function useEventStats(eventId: string) {
  const [stats, setStats] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('event_performance_stats')
        .select('*')
        .eq('event_id', eventId)
        .single()
      
      if (!error) setStats(data)
    }

    fetchStats()

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, () => {
        fetchStats() // Re-fetch whenever a new scan occurs
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return stats
}
