"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerForEvent(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const eventId = formData.get("eventId") as string;
  const name = (formData.get("name") as string) || "Attendee";
  const email = (formData.get("email") as string) || "";

  try {
    await prisma.registration.create({
      data: {
        eventId,
        userId,
        name,
        email,
      },
    });
    revalidatePath(`/events/${eventId}`);
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("You may already be registered for this event.");
  }
}
