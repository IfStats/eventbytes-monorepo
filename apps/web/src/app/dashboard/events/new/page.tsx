'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TicketTierInput {
  name: string;
  price: number;
  capacity: number;
}

export default function NewEventPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    venueName: '',
    startTime: '',
    endTime: '',
  });

  const [ticketTiers, setTicketTiers] = useState<TicketTierInput[]>([
    { name: 'General Admission', price: 0, capacity: 100 },
  ]);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleTierChange = (index: number, field: keyof TicketTierInput, value: any) => {
    const updatedTiers = [...ticketTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setTicketTiers(updatedTiers);
  };

  const addTicketTier = () => {
    setTicketTiers([...ticketTiers, { name: '', price: 0, capacity: 50 }]);
  };

  const removeTicketTier = (index: number) => {
    if (ticketTiers.length === 1) return;
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...eventForm,
        ticketTiers: ticketTiers.map((tier) => ({
          ...tier,
          price: Number(tier.price),
          capacity: Number(tier.capacity),
        })),
      };

      const response = await fetch('/your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organizer-id': 'mock-organizer-uuid',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create event listings.');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create event listings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Create a New Event</h1>
        <p className="mt-1 text-sm text-gray-500">List details and specify multi-tier ticket categories.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                name="title"
                required
                value={eventForm.title}
                onChange={handleEventChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={3}
                value={eventForm.description}
                onChange={handleEventChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Venue Name / Location</label>
              <input
                type="text"
                name="venueName"
                required
                value={eventForm.venueName}
                onChange={handleEventChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  required
                  value={eventForm.startTime}
                  onChange={handleEventChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  required
                  value={eventForm.endTime}
                  onChange={handleEventChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ticket Tiers Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Ticket Inventory Tiers</h3>
              <button
                type="button"
                onClick={addTicketTier}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                + Add Tier
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {ticketTiers.map((tier, index) => (
                <div key={index} className="flex items-end gap-4 rounded-md bg-gray-50 p-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">Tier Name</label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                      placeholder="e.g. VIP Pass"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium text-gray-500">Price (₦)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tier.price}
                      onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium text-gray-500">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={tier.capacity}
                      onChange={(e) => handleTierChange(index, 'capacity', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {ticketTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketTier(index)}
                      className="pb-2 text-sm text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading ? 'Publishing Event...' : 'Publish Event Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
