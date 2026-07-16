'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  ticket_price: number;
  image_url?: string;
  organizer_id: string;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEventDetails() {
      if (!params.id) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (fetchError || !data) {
        setError('Could not retrieve event details.');
        setLoading(false);
        return;
      }

      // Security Check: Only the organizer can edit this event
      if (data.organizer_id !== user.id) {
        setError('You are not authorized to edit this event.');
        setLoading(false);
        return;
      }

      // Pre-fill state
      setTitle(data.title);
      setDescription(data.description);
      setLocation(data.location);
      setCurrentImageUrl(data.image_url || '');
      setTicketPrice(data.ticket_price.toString());
      
      // Convert UTC timestamp to local datetime-local format (YYYY-MM-DDTHH:MM)
      if (data.event_date) {
        const localDate = new Date(data.event_date);
        const offset = localDate.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(localDate.getTime() - offset);
        setEventDate(adjustedDate.toISOString().slice(0, 16));
      }

      setLoading(false);
    }

    fetchEventDetails();
  }, [params.id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User session not found.');

      let finalImageUrl = currentImageUrl;

      // 1. Upload new thumbnail image if selected
      if (newImageFile) {
        const fileExt = newImageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-thumbnails')
          .upload(filePath, newImageFile);

        if (uploadError) {
          throw new Error(`New image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('event-thumbnails')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Update database record
      const { error: updateError } = await supabase
        .from('events')
        .update({
          title,
          description,
          location,
          event_date: eventDate,
          ticket_price: parseFloat(ticketPrice) || 0,
          image_url: finalImageUrl,
        })
        .eq('id', params.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading event information...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Edit Event</h1>
          <p className="text-slate-400 text-sm mt-1">Modify your event settings below.</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-slate-400 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Event Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Thumbnail Image Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Event Thumbnail Image</label>
          <div className="border border-dashed border-slate-800 rounded-xl p-4 bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 transition relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewImageFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-2xl">📸</span>
            <span className="text-xs text-slate-400 font-medium">
              {newImageFile ? `Replace with: ${newImageFile.name}` : 'Click to replace image'}
            </span>
            {currentImageUrl && !newImageFile && (
              <span className="text-[10px] text-emerald-400">Current image will be kept</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ticket Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location / Venue</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-4 rounded-xl shadow-lg transition duration-150 mt-4"
        >
          {saving ? 'Saving changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
