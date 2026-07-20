'use client'

import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'

export function CreateEventForm() {
  const { userId, isLoaded } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!userId) {
    return <div>Please sign in to create events</div>
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      date: formData.get('date'),
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Refresh events or redirect
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Event Title" required className="border p-2 w-full" />
      <textarea name="description" placeholder="Description" className="border p-2 w-full" />
      <input name="location" placeholder="Location" className="border p-2 w-full" />
      <input name="date" type="datetime-local" className="border p-2 w-full" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}
