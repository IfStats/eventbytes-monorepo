'use client';

import { useState } from 'react';
import { withAuth } from '../../components/withAuth';
import { useRouter } from 'next/navigation';

function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState({ title: '', date: '', location: '', description: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setEventData({ title: '', date: '', location: '', description: '' });
        alert('Event created successfully!');
      }
    } catch (err) {
      console.error('Failed to create event', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight text-emerald-500">EventBytes</h1>
          <p className="text-xs text-zinc-500">Organizer Console</p>
        </div>
        
        <nav className="space-y-1">
          <a href="#" className="flex items-center rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100">Overview</a>
          <a href="#" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition">My Events</a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition duration-200"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        <header className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h2>
            <p className="mt-1 text-sm text-zinc-400">Manage your schedule, metrics, and live registrations.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-emerald-500 transition duration-200"
          >
            Create Event
          </button>
        </header>

        {/* Analytics Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm font-medium text-zinc-400">Total Events</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">0</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm font-medium text-zinc-400">Active Registrations</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">0</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm font-medium text-zinc-400">Total Revenue</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">$0.00</p>
          </div>
        </div>

        {/* Modal / Slide-over for Event Creation */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-zinc-100 mb-4">Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase text-zinc-400 mb-1">Event Title</label>
                  <input 
                    type="text" required
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase text-zinc-400 mb-1">Date</label>
                    <input 
                      type="date" required
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase text-zinc-400 mb-1">Location</label>
                    <input 
                      type="text" required placeholder="Online / Venue"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-zinc-400 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200">Cancel</button>
                  <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-emerald-500">Save Event</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
