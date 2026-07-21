'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
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
      },
    })
  } catch (error) {
    console.error('Failed to create event:', error)
    throw new Error('Database error while creating event.')
  }

  revalidatePath('/events')
  redirect('/events')
}