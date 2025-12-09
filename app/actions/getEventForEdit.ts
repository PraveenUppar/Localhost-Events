// app/actions/getEventForEdit.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getEventForEdit(eventId: string) {
  const { userId } = await auth();

  if (!userId) return null;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketVariants: true },
  });

  // Security Check: If event doesn't exist OR user is not the organizer
  if (!event || event.organizerId !== userId) {
    return null;
  }

  return event;
}
