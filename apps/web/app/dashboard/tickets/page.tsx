'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  ticket_token: string;
  status: string;
  events: {
    title: string;
    event_date: string;
    location: string;
  };
}

// Simple Inline Component to render QR Code without npm packages
function MiniQRCode({ value }: { value: string }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generates a quick, clean QR code image using a free, secure public API
    const encodedValue = encodeURIComponent(value);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}`);
  }, [value]);

  return qrUrl ? (
    <img 
      src={qrUrl} 
      alt="Ticket QR Code" 
      className="w-24 h-24 object-contain"
    />
  ) : (
    <div className="w-24 h-24 bg-slate-800 animate-pulse rounded-lg" />
  );
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyTickets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          ticket_token,
          status,
          events (
            title,
            event_date,
            location
          )
        `)
        .eq('user_id', user.id);

      if (!error && data) {
        setTickets(data as any);
      }
      setLoading(false);
    }

    fetchMyTickets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">My Tickets</h1>
        <p className="text-slate-400 text-sm mt-1">Present these QR codes at the venue entrance for verification.</p>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm text-center py-8">Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          You don't have any tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const date = new Date(ticket.events.event_date);
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={ticket.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {ticket.status === 'valid' ? '● Active Ticket' : `● ${ticket.status}`}
                  </span>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{ticket.events.title}</h3>
                  <p className="text-slate-400 text-xs">📅 {formattedDate}</p>
                  <p className="text-slate-500 text-xs">📍 {ticket.events.location}</p>
                </div>
                
                {/* QR Code Container */}
                <div className="bg-white p-2.5 rounded-xl flex-shrink-0 shadow-lg">
                  <MiniQRCode value={ticket.ticket_token} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
