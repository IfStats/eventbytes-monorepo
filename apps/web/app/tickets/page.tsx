import { createClient } from '@/lib/supabase/server'

export default async function MyTicketsPage() {
  const supabase = await createClient()
  
  // 1. Fetch tickets for the current user
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*, events(title, event_date)')

  if (error) return <div>Error loading your tickets.</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {tickets?.length === 0 ? (
        <p>You haven't purchased any tickets yet.</p>
      ) : (
        <div className="grid gap-4">
          {tickets?.map((ticket: any) => (
            <div key={ticket.id} className="p-4 border rounded shadow-sm">
              <h2 className="font-bold text-lg">{ticket.events?.title}</h2>
              <p>Attendee: {ticket.attendee_name}</p>
              <p>Status: {ticket.status}</p>
              <p className="text-sm text-gray-500">
                Purchased on: {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
