import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

serve(async (req) => {
  const { record } = await req.json() // Data from the 'tickets' table

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev", // Use your verified domain
      to: record.attendee_email,
      subject: "Your Event Ticket Confirmation",
      html: `<p>Hi ${record.attendee_name}, your ticket is confirmed!</p>`
    }),
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
