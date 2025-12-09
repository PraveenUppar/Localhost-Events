"use server";
import { Resend } from "resend";
import { Stripe } from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Use the stable version matching your package.json
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function verifyPurchase(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    const existingOrder = await prisma.order.findFirst({
      where: { stripePaymentId: sessionId },
    });
    if (existingOrder) {
      return { success: true, message: "Order already processed" };
    }

    const userId = session.metadata?.userId;
    const ticketVariantId = session.metadata?.ticketVariantId;
    const eventId = session.metadata?.eventId;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    const userEmail = session.customer_details?.email;
    const userName = session.customer_details?.name || "Guest User";

    if (!userId || !ticketVariantId || !eventId || !userEmail) {
      return { success: false, error: "Invalid transaction data" };
    }

    // --- TRANSACTION START ---
    await prisma.$transaction(async (tx) => {
      // 1. Upsert User
      await tx.user.upsert({
        where: { id: userId },
        create: { id: userId, email: userEmail, name: userName },
        update: {},
      });

      // 2. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          status: "PAID",
          totalAmount: amountTotal,
          stripePaymentId: sessionId,
        },
      });

      // 3. Decrement Stock (ATOMIC OPERATION)
      // If this tries to go below 0, the SQL constraint will throw an error here
      await tx.ticketVariant.update({
        where: { id: ticketVariantId },
        data: { totalStock: { decrement: 1 } },
      });

      // 4. Create Ticket
      // We do this last. If stock failed, this never happens.
      await tx.ticket.create({
        data: {
          orderId: order.id,
          ticketVariantId,
          eventId,
          status: "VALID",
        },
      });
    });
    // --- TRANSACTION END ---

    // Email logic (kept same as yours)
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: userEmail,
        subject: `Your Ticket for ${eventId}`, // Pro-tip: Fetch event title in the transaction to use here
        html: `
          <h1>You're going to the event!</h1>
          <p>We have confirmed your ticket purchase.</p>
          <p><strong>Amount Paid:</strong> $${amountTotal}</p>
          <br />
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/tickets">View Ticket</a></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Verification failed:", error);

    // --- THE RACE CONDITION FIX ---
    // P2002 is Prisma's code for unique constraint violations
    // P2003 is foreign key violations
    // Raw database errors often appear in 'message'
    if (
      error.message?.includes("stock_non_negative") ||
      error.code === "P2002"
    ) {
      // This is the "Oversold" scenario.
      // We return success: false so the UI shows an error.
      // In a real app, you would initiate a Stripe Refund here.
      return { success: false, error: "Sorry, this ticket just sold out!" };
    }

    return { success: false, error: "Server error during verification" };
  }
}
