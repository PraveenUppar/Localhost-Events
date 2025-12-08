"use server";

import { Stripe } from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function createCheckoutSession(ticketVariantId: string) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  // 1. Fetch the ticket details from DB
  const ticketVariant = await prisma.ticketVariant.findUnique({
    where: { id: ticketVariantId },
    include: { event: true },
  });

  if (!ticketVariant) throw new Error("Ticket not found");

  // 2. Create the "Envelope" (Session)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,

    // What is visible on the receipt
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${ticketVariant.event.title} - ${ticketVariant.name}`,
          },
          unit_amount: Math.round(Number(ticketVariant.price) * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    // Redirect URLs
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${ticketVariant.event.id}`,

    // 3. THE SECRET NOTE (Metadata)
    // We attach IDs here so we can read them when the user comes back.
    metadata: {
      userId: userId,
      ticketVariantId: ticketVariant.id,
      eventId: ticketVariant.event.id,
    },
  });

  // 4. Send user to Stripe
  redirect(session.url!);
}
