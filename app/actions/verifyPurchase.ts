"use server";

import { Stripe } from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function verifyPurchase(sessionId: string) {
  try {
    // 1. Ask Stripe for the Session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Security Check: Did they actually pay?
    if (session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    // 3. Duplicate Check: Did we already give them a ticket?
    const existingOrder = await prisma.order.findFirst({
      where: { stripePaymentId: sessionId },
    });
    if (existingOrder) {
      return { success: true, message: "Order already processed" };
    }

    // 4. Open the "Secret Note" (Metadata)
    const userId = session.metadata?.userId;
    const ticketVariantId = session.metadata?.ticketVariantId;
    const eventId = session.metadata?.eventId;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    // User details from Stripe input
    const userEmail = session.customer_details?.email;
    const userName = session.customer_details?.name || "Guest User";

    if (!userId || !ticketVariantId || !eventId || !userEmail) {
      console.error("Missing metadata:", session.metadata);
      return { success: false, error: "Invalid transaction data" };
    }

    // 5. DATABASE TRANSACTION
    await prisma.$transaction(async (tx) => {
      // A. THE FIX: Create User if missing
      await tx.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: userEmail,
          name: userName,
        },
        update: {}, // If they exist, do nothing
      });

      // B. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          status: "PAID",
          totalAmount: amountTotal,
          stripePaymentId: sessionId,
        },
      });

      // C. Create Ticket
      await tx.ticket.create({
        data: {
          orderId: order.id,
          ticketVariantId,
          eventId,
          status: "VALID",
        },
      });

      // D. Update Stock
      await tx.ticketVariant.update({
        where: { id: ticketVariantId },
        data: { totalStock: { decrement: 1 } },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Verification failed:", error);
    return { success: false, error: "Server error during verification" };
  }
}
