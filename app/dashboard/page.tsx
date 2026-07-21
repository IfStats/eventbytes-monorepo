import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Event Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your events and track performance.</p>
          </div>
          <Link
            href="/events/create"
            className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Get started by creating your first event.</p>
            <Link
              href="/events/create"
              className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">📍 {event.location}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-900">Price: GHS {event.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
