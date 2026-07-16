'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // File state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to create an event.');
        setLoading(false);
        return;
      }

      let finalImageUrl = '';

      // 2. Upload file to Supabase Storage if an image was selected
      if (imageFile) {
        // Create a unique file name to avoid collisions
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-thumbnails')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        // Get the public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('event-thumbnails')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 3. Save the event details in the database
      const { error: insertError } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            location,
            event_date: eventDate,
            ticket_price: parseFloat(ticketPrice) || 0,
            image_url: finalImageUrl, // Save the uploaded file URL
            organizer_id: user.id,
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 4. Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Create New Event</h1>
        <p className="text-slate-400 text-sm mt-1">Fill out the details below to host your event.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            ⚠️ {error}
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Event Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="Shatta Wale SM Night"
          />
        </div>

        {/* Thumbnail Image File Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Event Thumbnail Image</label>
          <div className="border border-dashed border-slate-800 rounded-xl p-4 bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 transition relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-2xl">📸</span>
            <span className="text-xs text-slate-400 font-medium">
              {imageFile ? `Selected: ${imageFile.name}` : 'Click to upload or drag & drop'}
            </span>
            <span className="text-[10px] text-slate-500">Supports PNG, JPG, or WEBP</span>
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
              placeholder="50.00"
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
            placeholder="Black Star Square, Accra"
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
            placeholder="Describe your event details, schedules, rules, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-4 rounded-xl shadow-lg transition duration-150 mt-4"
        >
          {loading ? 'Uploading & Creating Event...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
}
