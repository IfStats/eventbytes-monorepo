import Link from "next/link";

import { deleteEvent } from "@/app/actions/event";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
}

export function HostEventCard({ id, title, description, date, location, price }: EventCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        <div className="mt-4 space-y-1 text-xs text-gray-500">
          <p>
            📅{" "}
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>📍 {location}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
        <Link
          href={`/dashboard/events/${id}/edit`}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Edit
        </Link>
        <form action={deleteEvent}>
          <input type="hidden" name="eventId" value={id} />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
