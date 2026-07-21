import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface AttendeeListProps {
  eventId: string;
}

export async function AttendeeList({ eventId }: AttendeeListProps) {
  const { userId } = await auth();
  if (!userId) return null;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: true,
    },
  });

  if (!event || event.hostId !== userId) {
    return <p className="text-sm text-gray-500">You do not have permission to view attendees for this event.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Registered Attendees ({event.registrations.length})
      </h3>

      {event.registrations.length === 0 ? (
        <p className="text-sm text-gray-500">No attendees have signed up for this event yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {event.registrations.map((reg) => (
            <div key={reg.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{reg.name || "Anonymous User"}</p>
                <p className="text-xs text-gray-500">{reg.email || "No email provided"}</p>
              </div>
              <span className="text-xs text-gray-400">
                Registered on {new Date(reg.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
