import { createClient } from '@/lib/supabase/server'
import { EventsList } from '../../components/events/EventsList'

export default async function EventsPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await createClient()
  const query = searchParams.q || ''

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .ilike('title', `%${query}%`)

  if (error) {
    console.error("Error fetching events:", error)
    return <div>Error loading events.</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
      <form className="mb-6">
        <input
          name="q"
          placeholder="Search events..."
          className="border p-2 rounded w-full max-w-sm"
          defaultValue={searchParams.q}
        />
        <button type="submit" className="ml-2 bg-gray-800 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>
      <EventsList events={events ?? []} />
    </div>
  )
}
