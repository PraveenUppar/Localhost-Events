// app/actions/deleteEvent.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  // 1. Verify ownership
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizerId !== userId) {
    throw new Error("You are not authorized to delete this event");
  }

  // 2. Perform Delete
  // Note: If you have foreign keys (tickets), this might fail unless you set up cascading deletes
  // or delete the tickets first. For now, we try a direct delete.
  await prisma.event.delete({
    where: { id: eventId },
  });

  // 3. Refresh the page data
  revalidatePath("/account");
  revalidatePath("/");

  return { success: true };
}
