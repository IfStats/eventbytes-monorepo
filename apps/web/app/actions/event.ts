'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { prisma } from '../../src/lib/prisma'

export async function createEvent(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized. Please log in as a host.')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const coverImage = formData.get('coverImage') as string

  const ticketName = formData.get('ticketName') as string
  const price = parseFloat(formData.get('price') as string) || 0.0
  const quantity = parseInt(formData.get('quantity') as string, 10)

  await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      coverImage,
      hostId: userId,
      ticketTypes: {
        create: {
          name: ticketName || 'General Admission',
          price,
          quantity,
        },
      },
    },
  })

  redirect('/dashboard')
}