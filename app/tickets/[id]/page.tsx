import { PrismaClient } from '@prisma/client'
import { QRCodeSVG } from 'qrcode.react'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

interface PageProps {
  params: { id: string }
}

export default async function TicketPage({ params }: PageProps) {
  const registration = await prisma.registration.findUnique({
    where: { id: params.id },
    include: {
      event: true,
      ticketType: true,
    },
  })

  if (!registration) notFound()

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-black text-white p-6 text-center space-y-1">
          <span className="text-xs uppercase tracking-wider bg-gray-800 px-3 py-1 rounded-full">
            Confirmed Ticket
          </span>
          <h1 className="text-2xl font-bold pt-2">{registration.event.title}</h1>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500 text-sm">Attendee Name</span>
            <span className="font-medium text-gray-900">{registration.name}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="font-medium text-gray-900">{registration.email}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500 text-sm">Ticket Tier</span>
            <span className="font-medium text-gray-900">
              {registration.ticketType.name} ({registration.ticketType.price === 0 ? 'Free' : `₦${registration.ticketType.price}`})
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500 text-sm">Date & Time</span>
            <span className="font-medium text-gray-900">
              {new Date(registration.event.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between pb-2">
            <span className="text-gray-500 text-sm">Location</span>
            <span className="font-medium text-gray-900 text-right">{registration.event.location}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <QRCodeSVG value={registration.id} size={180} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Show this QR code at the door</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{registration.id}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}