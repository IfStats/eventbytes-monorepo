import { createEvent } from '@/app/actions/event'

export default function CreateEventPage() {

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create an Event</h1>
        <p className="text-sm text-gray-600 mt-1">
          Set up your event details and start selling tickets instantly.
        </p>
      </div>

      <form action={createEvent} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title *</label>
          <input
            name="title"
            required
            type="text"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="e.g. Accra Tech Meetup 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="Tell attendees what your event is about, schedule, and speakers..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date & Time *</label>
            <input
              name="date"
              required
              type="datetime-local"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Price (GHS / USD)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="0.00 for Free"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Venue *</label>
          <input
            name="location"
            required
            type="text"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="e.g. Accra Digital Centre or Online Link"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
        >
          Publish Event
        </button>
      </form>
    </div>
  )
}