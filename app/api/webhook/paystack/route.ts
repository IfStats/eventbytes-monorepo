export const dynamic = 'force-dynamic'

import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(bodyText)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(bodyText)

    if (event.event === 'charge.success') {
      const { metadata, customer } = event.data
      const eventId = metadata?.event_id
      const ticketTypeId = metadata?.ticket_type_id
      const attendeeName = metadata?.attendee_name || customer.email

      if (eventId && ticketTypeId) {
        await prisma.registration.create({
          data: {
            eventId,
            ticketTypeId,
            email: customer.email,
            name: attendeeName,
            status: 'PAID',
          },
        })
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}