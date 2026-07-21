'use client'
import { useEventStats } from '@/hooks/useEventStats'

export default function EventDashboard({ eventId }: { eventId: string }) {
  const stats = useEventStats(eventId)

  if (!stats) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded shadow">
        <h3>Tickets Sold</h3>
        <p className="text-2xl">{stats.tickets_sold}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3>Checked In</h3>
        <p className="text-2xl">{stats.tickets_scanned}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3>Revenue</h3>
        <p className="text-2xl">${stats.gross_revenue}</p>
      </div>
    </div>
  )
}
