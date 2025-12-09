// app/actions/getTickets.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getTickets() {
  const { userId } = await auth();

  if (!userId) return [];

  const tickets = await prisma.ticket.findMany({
    where: {
      // "Find tickets where the Order belongs to this User ID"
      order: {
        userId: userId,
      },
    },
    include: {
      event: true, // We need the Event Title, Date, Location
      ticketVariant: true, // We need the Ticket Name (e.g. "VIP")
    },
    orderBy: {
      createdAt: "desc", // Show newest tickets first
    },
  });

  return tickets;
}
