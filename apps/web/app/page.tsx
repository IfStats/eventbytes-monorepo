'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from './lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  ticket_price: number;
  image_url?: string;
  category?: string;
}

export default function PublicEventFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden font-sans select-none"
      style={{
        backgroundColor: '#050816',
        backgroundImage: `
          radial-gradient(circle at top left, #7C3AED 0%, transparent 35%),
          radial-gradient(circle at bottom right, #2563EB 0%, transparent 30%)
        `
      }}
    >
      {/* Navigation Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#7C3AED]/20">
              E
            </span>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              EventBytes
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/organizers"
              className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition duration-200"
            >
              Host an Event
            </Link>
            <Link
              href="/auth/register-attendee"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-semibold shadow-lg shadow-[#7C3AED]/25"
            >
              Sign Up / View Tickets
            </Link>
          </nav>
        </div>
      </header>

      {/* Public Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-indigo-400">
          🎟️ Discover Experiences
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
        >
          Discover & Book <br />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] bg-clip-text text-transparent">
            Amazing Live Events
          </span>
        </h1>
        <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Secure seats to concerts, tech summits, workshops, and local meetups instantly.
        </p>
      </section>

      {/* Grid of Events */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <h2
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            All Upcoming Events
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#0F172A]/10">
            <span className="text-4xl">🗓️</span>
            <p className="text-[#94A3B8] text-sm mt-2">No active upcoming events right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.location
              )}`;

              return (
                <div
                  key={event.id}
                  className="group flex flex-col justify-between bg-[#0F172A]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-[#0F172A]/60 transition-all duration-300"
                >
                  <Link href={`/events/${event.id}`} className="block">
                    <div className="h-48 w-full overflow-hidden bg-slate-950 relative">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-950/20 to-slate-900 flex items-center justify-center">
                          <span className="text-slate-700 text-xs font-semibold">No Image Banner</span>
                        </div>
                      )}

                      {event.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-sm border border-indigo-500/20 uppercase tracking-widest">
                          {event.category}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                        {formattedDate}
                      </span>
                      <Link href={`/events/${event.id}`}>
                        <h3
                          className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1"
                          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                        >
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-[#94A3B8] text-xs line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#94A3B8] hover:text-indigo-300 flex items-center gap-1.5 transition truncate max-w-[170px]"
                        title="View Location on Google Maps"
                      >
                        📍 <span className="underline decoration-dotted truncate">{event.location}</span>
                      </a>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {event.ticket_price === 0 ? 'Free' : `$${Number(event.ticket_price).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} EventBytes Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
            <Link href="/organizers" className="hover:text-white transition">Become an Organizer</Link>
            <Link href="/auth/register-attendee" className="hover:text-white transition">Attendee Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
