// app/actions/getOrganizerEvents.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getOrganizerEvents() {
  const { userId } = await auth();

  if (!userId) return [];

  const events = await prisma.event.findMany({
    where: {
      organizerId: userId, // Only get MY events
    },
    include: {
      _count: {
        select: { tickets: true }, // Let's count how many tickets were sold
      },
      ticketVariants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return events;
}
