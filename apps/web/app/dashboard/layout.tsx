import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Shared Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/50 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600 text-white font-black text-md">
              E
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              EventBytes
            </span>
          </div>
          <nav className="space-y-1">
            <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white">
              📊 Dashboard
            </Link>
            <Link href="/dashboard/events/new" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900/50 hover:text-white transition-colors">
              ➕ Create Event
            </Link>
          </nav>
        </div>
        <div className="border-t border-slate-900 pt-4">
          <Link href="/auth/login" className="block px-4 py-2 text-sm text-slate-500 hover:text-red-400 transition-colors">
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
