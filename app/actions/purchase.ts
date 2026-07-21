'use server'

import { createClient } from '@/lib/supabase/server'

export async function purchaseTicket(formData: {
  event_id: string
  attendee_name: string
  attendee_email: string
  attendee_phone: string
}) {
  const supabase = await createClient()
  
  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // 2. Insert the ticket
  const { data, error } = await supabase
    .from('tickets')
    .insert([
      {
        event_id: formData.event_id,
        user_id: user.id,
        attendee_name: formData.attendee_name,
        attendee_email: formData.attendee_email,
        attendee_phone: formData.attendee_phone,
        status: 'confirmed',
        ticket_token: crypto.randomUUID() // Generates a unique QR code identifier
      }
    ])

  if (error) throw error
  return data
}
