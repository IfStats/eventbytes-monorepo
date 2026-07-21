import EventDashboard from '@/components/dashboard/EventDashboard'

export default async function DashboardPage({ searchParams }: { searchParams: { eventId?: string } }) {
  const eventId = searchParams?.eventId ?? ''

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Event Dashboard</h1>
      {eventId ? <EventDashboard eventId={eventId} /> : <div>Missing eventId</div>}
    </div>
  )
}
