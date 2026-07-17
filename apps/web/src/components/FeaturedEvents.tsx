type FeaturedEvent = {
  id: number;
  title: string;
  date: Date;
  location: string;
};

export default function FeaturedEvents({ events }: { events: FeaturedEvent[] }) {
  return (
    <section className="bg-gray-50 px-6 py-12">
      <h2 className="mb-8 text-2xl font-bold">Featured This Week</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toDateString()} • {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
