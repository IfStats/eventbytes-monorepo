import { createEvent } from '../../actions/event'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function CreateEventPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Create a New Event</h1>
      <p className="text-gray-600 mb-8">Set up your event details and ticketing options below.</p>

      <form action={createEvent} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="e.g., Tech Founders Mixer Lagos" 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            name="description" 
            rows={4}
            placeholder="Tell attendees what your event is about..." 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input 
              type="datetime-local" 
              name="date" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
            <input 
              type="text" 
              name="location" 
              required 
              placeholder="e.g., Oriental Hotel, Victoria Island" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input 
            type="url" 
            name="coverImage" 
            placeholder="https://images.unsplash.com/..." 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <hr className="my-6 border-gray-100" />
        
        <h2 className="text-xl font-semibold mb-4">Initial Ticket Tier</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name</label>
            <input 
              type="text" 
              name="ticketName" 
              defaultValue="Regular" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHS/NGN/KES)</label>
            <input 
              type="number" 
              name="price" 
              step="0.01" 
              defaultValue="0" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              defaultValue="100" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Publish Event
        </button>
      </form>
    </div>
  )
}