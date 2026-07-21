'use client'
import { QRCodeSVG } from 'qrcode.react';

export default function TicketQRCode({ ticketId }: { ticketId: string }) {
  // This is the URL your scanner app will process
  const scanUrl = `${window.location.origin}/scan/${ticketId}`;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border flex flex-col items-center">
      <h3 className="font-bold mb-2">Your Ticket</h3>
      <QRCodeSVG value={scanUrl} size={200} />
      <p className="mt-2 text-sm text-gray-500">{ticketId}</p>
    </div>
  );
}
