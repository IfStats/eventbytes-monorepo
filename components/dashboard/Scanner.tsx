'use client'

import { useState } from 'react'
import { processTicketScan } from '@/lib/actions/check-in'

export default function TicketScanner({ eventId }: { eventId: string }) {
  const [ticketId, setTicketId] = useState('')
  const [result, setResult] = useState<{ status: string } | null>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await processTicketScan(ticketId)
    setResult(response)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Ticket Scanner</h2>
      
      <form onSubmit={handleScan} className="flex gap-2">
        <input 
          className="border rounded p-2 flex-grow"
          placeholder="Enter Ticket ID"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Scan</button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded text-center font-bold ${
          result.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {result.status.toUpperCase()}
        </div>
      )}
    </div>
  )
}
