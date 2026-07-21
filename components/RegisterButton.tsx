"use client";

import { registerForEvent } from "@/app/actions/registration";
import { useTransition } from "react";

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
}

export function RegisterButton({ eventId, isRegistered }: RegisterButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRegister = (formData: FormData) => {
    startTransition(async () => {
      try {
        await registerForEvent(formData);
      } catch (error) {
        alert("Failed to register. You may already be registered.");
      }
    });
  };

  if (isRegistered) {
    return (
      <span className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-medium text-sm rounded-xl border border-emerald-100">
        ✓ You are registered
      </span>
    );
  }

  return (
    <form action={handleRegister}>
      <input type="hidden" name="eventId" value={eventId} />
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50 shadow-sm"
      >
        {isPending ? "Registering..." : "Register for Event"}
      </button>
    </form>
  );
}
