// app/actions/getTicketById.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getTicketById(ticketId: string) {
  const { userId } = await auth();

  if (!userId) return null;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
      ticketVariant: true,
      order: true, // We need this to check ownership
    },
  });

  // Security Check: Does the logged-in user own the order for this ticket?
  if (!ticket || ticket.order.userId !== userId) {
    return null;
  }

  return ticket;
}
