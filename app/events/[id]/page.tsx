import { auth } from "@clerk/nextjs/server";

import { AttendeeList } from "@/components/AttendeeList";
import { RegisterButton } from "@/components/RegisterButton";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: true,
    },
  });

  if (!event) notFound();

  const isHost = userId === event.hostId;
  const isRegistered = event.registrations.some((reg) => reg.userId === userId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-3">
              ${event.price > 0 ? event.price.toFixed(2) : "Free"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          </div>
        </div>

        <p className="text-gray-600 mt-6 text-base leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500">Date & Time</p>
            <p className="text-base text-gray-900">
              📅{" "}
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-base text-gray-900">📍 {event.location}</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <strong className="text-gray-900">{event.registrations.length}</strong> people registered
          </p>

          {!isHost && <RegisterButton eventId={event.id} isRegistered={isRegistered} />}
        </div>
      </div>

      {isHost && <AttendeeList eventId={event.id} />}
    </div>
  );
}
