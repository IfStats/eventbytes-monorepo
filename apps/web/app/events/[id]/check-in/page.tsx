import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

interface CheckInPageProps {
  params: { id: string }
  searchParams: { code?: string; success?: string }
}

export default async function EventCheckInPage({ params, searchParams }: CheckInPageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const eventId = params.id

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        include: { ticketType: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!event || event.hostId !== userId) {
    return <div className="p-12 text-center text-red-600 font-bold">Unauthorized or Event Not Found</div>
  }

  async function handleCheckIn(formData: FormData) {
    'use server'

    const regId = formData.get('regId') as string
    if (!regId) return

    await prisma.registration.update({
      where: { id: regId },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
    })

    revalidatePath(`/events/${eventId}/check-in`)
  }

  const checkedInCount = event.registrations.filter((registration) => registration.isCheckedIn).length

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Door Check-In
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{event.title}</h1>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-gray-900">{checkedInCount} / {event.registrations.length}</div>
          <p className="text-xs text-gray-500">Attendees Checked In</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Guest List & Verification</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {event.registrations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No registrations found for this event yet.</div>
          ) : (
            event.registrations.map((registration) => (
              <div key={registration.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition">
                <div>
                  <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                  <p className="text-sm text-gray-500">
                    {registration.email} • <span className="font-medium text-gray-700">{registration.ticketType.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">ID: {registration.id}</p>
                </div>

                <div>
                  {registration.isCheckedIn ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                      Checked In {registration.checkedInAt && new Date(registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ) : (
                    <form action={handleCheckIn}>
                      <input type="hidden" name="regId" value={registration.id} />
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        Check In Guest
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}