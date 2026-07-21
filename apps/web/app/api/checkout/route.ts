import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, amount, eventId, ticketTypeId, name } = await req.json()

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/success`,
        metadata: {
          event_id: eventId,
          ticket_type_id: ticketTypeId,
          attendee_name: name,
        },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Payment initialization failed' }, { status: 400 })
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url })
  } catch (error) {
    console.error('Paystack error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}