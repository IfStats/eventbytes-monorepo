'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Redirect successfully to your new nested dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Left Decorative Column */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center space-x-2 relative z-10">
          <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            E
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            EventBytes
          </span>
        </div>

        {/* Dynamic Copy */}
        <div className="relative z-10 max-w-md space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            ✨ Welcome back
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Manage your event dashboard.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Monitor your ticket sales, manage attendee lists, and set up your next major event in seconds.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-8 border-t border-slate-800/60 max-w-sm flex gap-6 text-xs text-slate-500 font-medium">
          <span>✔ Live Ticketing</span>
          <span>✔ No Hidden Fees</span>
          <span>✔ QR Verification</span>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Organizer Login 👋
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Welcome back! Manage your event dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-150"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
