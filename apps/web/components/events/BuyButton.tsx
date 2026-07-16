'use client'

import { purchaseTicket } from '@/app/actions/purchase'

export function BuyButton({ eventId }: { eventId: string }) {
  return (
    <button
      onClick={async () => {
        // Simple trigger for now
        await purchaseTicket({
          event_id: eventId,
          attendee_name: 'Test User', // We'll make this dynamic later
          attendee_email: 'test@example.com',
          attendee_phone: '000-000-0000'
        })
        alert('Ticket purchased!')
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Purchase Ticket
    </button>
  )
}
