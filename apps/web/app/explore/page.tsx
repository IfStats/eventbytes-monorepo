'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  ticket_price: number;
  image_url?: string;
}

export default function ExploreEventsPage() {
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
      className="min-h-screen text-white py-12 px-6"
      style={{
        backgroundColor: '#050816',
        backgroundImage: `
          radial-gradient(circle at top left, #7C3AED 0%, transparent 35%),
          radial-gradient(circle at bottom right, #2563EB 0%, transparent 30%)
        `
      }}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              Explore Events
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">Find and book tickets to the best experiences.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/register-attendee" className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-sm font-semibold text-[#94A3B8] hover:text-white">
              Attendee Sign Up
            </Link>
            <Link href="/tickets" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:scale-[1.02] transition text-sm font-semibold">
              My Tickets 🎟️
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-[#0F172A]/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <span className="text-4xl">🗓️</span>
            <p className="text-[#94A3B8] text-sm mt-2">No upcoming events found.</p>
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

              return (
                <Link 
                  href={`/events/${event.id}`} 
                  key={event.id}
                  className="group block bg-[#0F172A]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-[#0F172A]/60 transition-all duration-300"
                >
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
                  </div>

                  <div className="p-6 space-y-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                      {formattedDate}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        {event.title}
                      </h3>
                      <p className="text-[#94A3B8] text-xs line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-[#94A3B8] truncate max-w-[150px]">
                        📍 {event.location}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {event.ticket_price === 0 ? 'Free' : `$${Number(event.ticket_price).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
