// app/events/[id]/page.tsx
import { getEventById } from "@/app/actions/getEventById";
import { notFound } from "next/navigation";
import { Calendar, MapPin, User } from "lucide-react"; // Ensure you have lucide-react installed or use text icons
// This is how we access the dynamic ID in Next.js 15 (Server Component)
import { createCheckoutSession } from "@/app/actions/createCheckoutSession";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound(); // Shows the 404 page if ID is wrong
  }

  // Assume single ticket type for now for simplicity
  const ticket = event.ticketVariants[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Image */}
            <div className="aspect-video bg-gray-200 rounded-xl w-full flex items-center justify-center text-gray-400">
              [Event Image Placeholder]
            </div>

            {/* Title & Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {event.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">{event.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Organizer</p>
                  <p className="font-semibold">{event.organizer.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The "Ticket" Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Get your ticket
              </h3>

              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <span className="font-medium block">
                      {ticket?.name || "Standard Ticket"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {ticket?.totalStock} seats left
                    </span>
                  </div>
                  <span className="font-bold text-xl">
                    ${Number(ticket?.price || 0)}
                  </span>
                </div>
              </div>

              {/* The Action Button */}
              {/* We will hook this up to Stripe next */}
              <div className="mt-6">
                {/* OPTION 1: User is Logged In -> Show Buy Button */}
                <SignedIn>
                  <form
                    action={async () => {
                      "use server";
                      await createCheckoutSession(ticket.id);
                    }}
                  >
                    <button
                      type="submit"
                      disabled={!ticket}
                      className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy Ticket{" "}
                      {ticket && Number(ticket.price) === 0 && "(Free)"}
                    </button>
                  </form>
                </SignedIn>

                {/* OPTION 2: User is Logged Out -> Show Sign In Button */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-200">
                      Sign in to Buy Ticket
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

              <p className="text-xs text-center text-gray-400 mt-4">
                Powered by Stripe • Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
