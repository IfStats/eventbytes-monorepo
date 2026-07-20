import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all events for the logged-in user
export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
      orderBy: { date: 'asc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST - Create a new event
export async function POST(req: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, location, date } = body

    // Verify user exists in Supabase (should be created by webhook)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: date ? new Date(date) : undefined,
        organizerId: userId,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
