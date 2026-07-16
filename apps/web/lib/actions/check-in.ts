'use server'

import { createClient } from '@/lib/supabase/server'

export async function processTicketScan(ticketId: string) {
  const supabase = await createClient()

  // This calls the SQL function we just created
  const { data, error } = await supabase
    .rpc('validate_and_scan_ticket', { target_ticket_id: ticketId })

  if (error) {
    console.error('Scan error:', error)
    return { status: 'error', message: 'System error' }
  }

  // data will be 'success', 'already_scanned', or 'invalid_ticket'
  return { status: data }
}
