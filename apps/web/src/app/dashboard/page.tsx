import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EventList } from '@/components/EventList'
import { CreateEventButton } from '@/components/CreateEventButton'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      events: {
        orderBy: { date: 'asc' },
      },
    },
  })

  if (!user) {
    // Webhook might not have created user yet, or something went wrong
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="text-gray-600">
          We're setting up your account. Please refresh in a moment.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user.name || user.email}
        </h1>
        <CreateEventButton />
      </div>

      {user.events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events yet. Create your first event!</p>
        </div>
      ) : (
        <EventList events={user.events} />
      )}
    </div>
  )
}
