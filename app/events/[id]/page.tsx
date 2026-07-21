'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

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

interface Ticket {
  id: string;
  event_id: string;
  ticket_token: string;
  quantity: number;
  attendee_name?: string;
  attendee_email?: string;
  attendee_phone?: string;
}

interface AttendeeInput {
  name: string;
  email: string;
  phone: string;
}

export default function EventDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Multi-ticket State
  const [quantity, setQuantity] = useState<number>(1);
  const [attendees, setAttendees] = useState<AttendeeInput[]>([
    { name: '', email: '', phone: '' }
  ]);

  useEffect(() => {
    async function initPage() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      // Pre-fill first attendee if user is logged in
      if (authUser) {
        setAttendees([{
          name: authUser.user_metadata?.full_name || '',
          email: authUser.email || '',
          phone: authUser.phone || ''
        }]);
      }

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventData) {
        setEvent(eventData);
      }

      if (authUser) {
        const { data: ticketData } = await supabase
          .from('tickets')
          .select('*')
          .eq('event_id', id)
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (ticketData) {
          setTicket(ticketData);
          setQuantity(ticketData.quantity || 1);
        }
      }
      setLoading(false);
    }

    if (id) {
      initPage();
    }
  }, [id]);

  // Sync attendee input form count with selected quantity
  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    setAttendees(prev => {
      const updated = [...prev];
      if (newQty > prev.length) {
        for (let index = prev.length; index < newQty; index++) {
          updated.push({ name: '', email: '', phone: '' });
        }
      } else {
        return updated.slice(0, newQty);
      }
      return updated;
    });
  };

  const handleAttendeeChange = (index: number, field: keyof AttendeeInput, value: string) => {
    setAttendees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCheckoutClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/register-attendee');
      return;
    }

    if (!event) {
      return;
    }

    if (event.ticket_price > 0) {
      setBooking(true);

      try {
        const primaryAttendee = attendees[0] || { name: '', email: '', phone: '' };
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: id,
            ticketTypeId: undefined,
            amount: totalCost,
            name: primaryAttendee.name,
            email: primaryAttendee.email,
          }),
        });

        const data = await res.json();
        if (data.authorization_url) {
          window.location.href = data.authorization_url;
          return;
        }

        alert(data.error || 'Something went wrong');
      } catch (error) {
        console.error(error);
        alert('Something went wrong');
      } finally {
        setBooking(false);
      }

      return;
    }

    executeBooking();
  };

  const executeBooking = async () => {
    setBooking(true);

    const ticketToken = crypto.randomUUID();

    // Store consolidated details in main ticket entry
    const primaryAttendee = attendees[0] || { name: '', email: '', phone: '' };

    // Explicitly construct payload matching our RLS rules
    const { data: newTicket, error } = await supabase
      .from('tickets')
      .insert([
        {
          event_id: id,
          user_id: user.id,
          ticket_token: ticketToken,
          quantity: quantity,
          attendee_name: primaryAttendee.name,
          attendee_email: primaryAttendee.email,
          attendee_phone: primaryAttendee.phone,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insertion Error:', error);
      alert(`Booking failed: ${error.message}`);
    } else if (newTicket) {
      setTicket(newTicket);
    }
    setBooking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link href="/" className="text-indigo-400 hover:underline">Back to feed</Link>
      </div>
    );
  }

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location
  )}`;

  const totalCost = event.ticket_price * quantity;

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
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] flex items-center justify-center font-bold text-white text-lg shadow-lg">
              E
            </span>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              EventBytes
            </span>
          </Link>
          <Link href="/" className="text-xs text-[#94A3B8] hover:text-white transition">
            ← Explore Events
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        {/* Event Banner */}
        <div className="w-full h-[280px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-950 border border-white/5 relative mb-12 shadow-2xl">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950/20 to-slate-900 flex items-center justify-center">
              <span className="text-slate-500 text-sm">No Event Image Banner</span>
            </div>
          )}

          {event.category && (
            <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-600 border border-indigo-500/20 uppercase tracking-wider">
              {event.category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Hand: Core Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                {event.title}
              </h1>
              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-center gap-2 text-sm">
                  <span>📅</span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {event.location}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 space-y-4">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>About This Event</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Booking / Ticket Widget Form Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="w-full max-w-[420px] p-8 space-y-8"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '28px'
              }}
            >
              {!ticket ? (
                <form onSubmit={handleCheckoutClick} className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Checkout</span>
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Configure Booking</h3>
                  </div>

                  {/* Quantity Counter Selector */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-sm text-slate-300 font-medium">Number of Tickets</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center font-bold text-lg border border-white/5 transition"
                      >
                        -
                      </button>
                      <span className="font-bold text-base w-4 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(Math.min(5, quantity + 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center font-bold text-lg border border-white/5 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Custom Attendee Ticket Forms */}
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                    {attendees.map((attendee, index) => (
                      <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                          Ticket {index + 1} Holder Details
                        </span>
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={attendee.name}
                            onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none text-white"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={attendee.email}
                            onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none text-white"
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={attendee.phone}
                            onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Pricing Cost Summary */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Standard Pass Ticket</span>
                      <span>{event.ticket_price === 0 ? 'Free' : `$${Number(event.ticket_price).toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Quantity</span>
                      <span>x{quantity}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-sm font-semibold">Total Amount</span>
                      <span className="text-2xl font-extrabold text-emerald-400">
                        {totalCost === 0 ? 'Free' : `$${totalCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={booking}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 transition-all duration-200 font-semibold text-center shadow-lg shadow-[#7C3AED]/30 flex items-center justify-center"
                  >
                    {booking ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : user ? (
                      event.ticket_price > 0 ? `Pay ₦${totalCost.toLocaleString()} & Get Ticket` : 'Confirm Free Booking'
                    ) : (
                      'Sign In to Checkout'
                    )}
                  </button>
                </form>
              ) : (
                /* Confirmed Booking Display with Attendee Details */
                <div className="space-y-6 flex flex-col items-center">
                  <div className="space-y-1 text-center">
                    <span className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5">
                      🎉 {ticket.quantity} Passes Confirmed!
                    </span>
                    <p className="text-xs text-[#94A3B8]">Present these barcodes at the entrance gate.</p>
                  </div>

                  {/* Ticket Holder Badges */}
                  <div className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs space-y-1 text-left">
                    <div className="text-[#94A3B8] font-semibold text-[10px] uppercase tracking-wider mb-1">Lead Attendee</div>
                    <div><span className="text-[#94A3B8]">Name:</span> {ticket.attendee_name || 'N/A'}</div>
                    <div><span className="text-[#94A3B8]">Email:</span> {ticket.attendee_email || 'N/A'}</div>
                    <div><span className="text-[#94A3B8]">Phone:</span> {ticket.attendee_phone || 'N/A'}</div>
                  </div>

                  {/* Multi-QR Carousel */}
                  <div className="w-full space-y-6 max-h-[250px] overflow-y-auto pr-1">
                    {Array.from({ length: ticket.quantity || 1 }).map((_, index) => {
                      const individualToken = `${ticket.ticket_token}-pass-${index + 1}`;
                      return (
                        <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center gap-3">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">
                            Pass {index + 1} of {ticket.quantity}
                          </span>
                          <div className="p-3 bg-white rounded-xl flex items-center justify-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(individualToken)}`}
                              alt={`Pass ${index + 1} QR`}
                              className="w-32 h-32"
                            />
                          </div>
                          <code className="text-[10px] text-indigo-300 break-all font-mono opacity-80">
                            {individualToken}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
