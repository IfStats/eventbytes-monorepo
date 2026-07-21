import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { prisma } from "@/lib/db";

export default async function MyBookingsPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please sign in to view your booked events.</p>
      </div>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: {
      event: true,
    },
    orderBy: {
      event: { date: "asc" },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Booked Events</h1>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Discover Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map(({ event }) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mb-3">
                  Registered
                </span>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>

                <div className="mt-4 space-y-1 text-xs text-gray-500">
                  <p>
                    📅{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>📍 {event.location}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                <Link
                  href={`/events/${event.id}`}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
