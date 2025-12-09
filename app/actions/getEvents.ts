// app/actions/getEvents.ts
"use server";

import { prisma } from "@/lib/db";

export async function getEvents(query?: string) {
  const events = await prisma.event.findMany({
    where: {
      OR: [
        // Case insensitive search in Title OR Location
        { title: { contains: query || "", mode: "insensitive" } },
        { location: { contains: query || "", mode: "insensitive" } },
        { description: { contains: query || "", mode: "insensitive" } },
      ],
    },
    orderBy: {
      date: "asc",
    },
    include: {
      ticketVariants: true,
      organizer: {
        select: { name: true },
      },
    },
  });

  return events;
}
