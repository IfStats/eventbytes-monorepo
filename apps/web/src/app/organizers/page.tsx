'use client';

import React from 'react';
import Link from 'next/link';

export default function OrganizersPage() {
  return (
    <div
      className="min-h-screen text-white relative overflow-hidden font-sans select-none"
      style={{
        backgroundColor: '#050816',
        backgroundImage: `
          radial-gradient(circle at top left, #7C3AED 0%, transparent 35%),
          radial-gradient(circle at bottom right, #2563EB 0%, transparent 30%)
        `,
      }}
    >
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
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/organizers/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-semibold shadow-lg shadow-[#7C3AED]/25"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-indigo-400">
            EventBytes
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Your next-generation <br />
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] bg-clip-text text-transparent">
              event management
            </span>{' '}
            <br />
            platform.
          </h1>

          <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-xl">
            Launch beautiful event pages, sell tickets, monitor attendance, and grow your audience.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
            {['Ticket Sales', 'Analytics', 'QR Check-in', 'Team Management'].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400">
                  ✔
                </span>
                {feature}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/organizers/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold text-center shadow-lg shadow-[#7C3AED]/30"
            >
              Register
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition duration-200 font-semibold text-center text-[#94A3B8] hover:text-white"
            >
              Need tickets instead? Browse Events -&gt;
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            className="w-full max-w-[400px] p-8 space-y-8"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '28px',
            }}
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Overview</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                EventBytes by the numbers
              </h3>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Organizers', value: '25K+' },
                { label: 'Events Hosted', value: '120K+' },
                { label: 'Average Rating', value: '4.9*' },
              ].map((stat) => (
                <div key={stat.label} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-[#94A3B8] text-xs font-semibold block uppercase tracking-wider">{stat.label}</span>
                  <span className="text-3xl font-extrabold tracking-tight mt-1 block">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
