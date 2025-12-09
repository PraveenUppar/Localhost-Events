// app/actions/updateEvent.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateEvent(eventId: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  // 1. Double-Check Ownership (Security)
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent || existingEvent.organizerId !== userId) {
    throw new Error("You do not own this event");
  }

  // 2. Extract Data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  // 3. Update Database
  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      location,
      date: new Date(dateStr),
    },
  });

  // 4. Clear Cache & Redirect
  revalidatePath("/account");
  revalidatePath(`/events/${eventId}`);
  redirect("/account");
}
