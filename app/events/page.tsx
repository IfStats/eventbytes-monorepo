import Link from 'next/link'

import { prisma } from '@/lib/prisma'

export default async function PublicEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { ticketTypes: true },
  })

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">Explore Upcoming Events</h1>
        <p className="text-gray-600">Discover experiences, secure your tickets, and connect with communities on EventBytes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-gray-500">
            No public events posted yet. Check back soon!
          </div>
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600 truncate max-w-[180px]">📍 {event.location}</span>
                <span className="text-indigo-600 font-semibold shrink-0">View Event →</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
