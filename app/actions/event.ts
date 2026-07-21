'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const price = parseFloat(formData.get('price') as string) || 0

  if (!title || !date || !location) {
    throw new Error('Please fill in all required fields.')
  }

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price,
        hostId: userId,
      },
    })
  } catch (error) {
    console.error('Failed to create event:', error)
    throw new Error('Database error while creating event.')
  }

  revalidatePath('/events')
  redirect('/events')
}

export async function editEvent(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const eventId = formData.get('eventId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const price = Number(formData.get('price')) || 0

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!event || event.hostId !== userId) {
    throw new Error('Unauthorized or event not found')
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      date: new Date(date),
      location,
      price,
    },
  })
}

export async function getFilteredEvents(searchParams?: { q?: string; location?: string }) {
  const query = searchParams?.q || ''
  const locationFilter = searchParams?.location || ''

  return await prisma.event.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        locationFilter
          ? { location: { contains: locationFilter, mode: 'insensitive' } }
          : {},
        { date: { gte: new Date() } },
      ],
    },
    orderBy: { date: 'asc' },
  })
}