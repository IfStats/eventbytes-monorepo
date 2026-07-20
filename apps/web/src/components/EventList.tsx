interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  date: string | null
  createdAt: string
}

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No events yet. Create your first event!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-4 hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          {event.description && (
            <p className="text-gray-600 text-sm mt-1">{event.description}</p>
          )}
          {event.location && (
            <p className="text-gray-500 text-sm mt-2">📍 {event.location}</p>
          )}
          {event.date && (
            <p className="text-gray-500 text-sm">
              🗓️ {new Date(event.date).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
