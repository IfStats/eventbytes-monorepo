'use client'

import { useState } from 'react'
import { purchaseTicket } from '@/app/actions/purchase'

export function CheckoutModal({ eventId, onClose }: { eventId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handlePurchase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    await purchaseTicket({
      event_id: eventId,
      attendee_name: formData.get('name') as string,
      attendee_email: formData.get('email') as string,
      attendee_phone: formData.get('phone') as string
    })
    
    alert('Ticket confirmed!')
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handlePurchase} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Complete Purchase</h2>
        <input name="name" placeholder="Full Name" required className="block w-full border p-2 mb-2" />
        <input name="email" type="email" placeholder="Email" required className="block w-full border p-2 mb-2" />
        <input name="phone" placeholder="Phone Number" required className="block w-full border p-2 mb-4" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  )
}
