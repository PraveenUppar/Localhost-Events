// Stripe doesn't know about your database. We must attach the userId and ticketId to the payment so Stripe can send it back to us later in the Webhook.

// app/actions/createCheckoutSession.ts
"use server";

import { Stripe } from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Use latest API version or typescript will complain
});

export async function createCheckoutSession(ticketVariantId: string) {
  const { userId } = await auth();
  const user = await currentUser();

  // 1. Authentication Check
  if (!userId || !user) {
    // If not logged in, you might want to redirect to login
    redirect("/sign-in");
  }

  // 2. Fetch Ticket Details from DB (Security check: don't trust frontend price)
  const ticketVariant = await prisma.ticketVariant.findUnique({
    where: { id: ticketVariantId },
    include: { event: true }, // We need event title
  });

  if (!ticketVariant) {
    throw new Error("Ticket not found");
  }

  // 3. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress, // Auto-fill user email

    // What are they buying?
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${ticketVariant.event.title} - ${ticketVariant.name}`,
            description: ticketVariant.event.location,
          },
          unit_amount: Math.round(Number(ticketVariant.price) * 100), // Stripe expects Cents (e.g. $10 = 1000)
        },
        quantity: 1,
      },
    ],

    mode: "payment",

    // THE MOST IMPORTANT PART: Metadata
    // We attach this data so we can read it in the Webhook later
    metadata: {
      userId: userId, // Clerk ID
      ticketVariantId: ticketVariant.id,
      eventId: ticketVariant.event.id,
    },

    // Redirect URLs
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${ticketVariant.event.id}`,
  });

  // 4. Redirect User to Stripe
  if (session.url) {
    redirect(session.url);
  }
}
