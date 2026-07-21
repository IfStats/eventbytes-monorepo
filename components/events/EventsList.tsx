'use client'

import { useState } from 'react'
import { CheckoutModal } from '../CheckoutModal'

type EventItem = {
  id: string | number
  title: string
  description: string | null
  event_date: string
  location: string | null
  ticket_price: number | null
}

export function EventsList({ events }: { events: EventItem[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  return (
    <>
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-bold text-lg">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
            </div>
            <p className="mt-2 font-bold text-blue-600">GHS {event.ticket_price}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSelectedEventId(String(event.id))}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Buy Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEventId && (
        <CheckoutModal eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />
      )}
    </>
  )
}
