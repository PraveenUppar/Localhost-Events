// app/account/page.tsx
import { getTickets } from "@/app/actions/getTickets";
import { getOrganizerEvents } from "@/app/actions/getOrganizerEvents";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Ticket, Calendar } from "lucide-react"; // npm install lucide-react
import { deleteEvent } from "@/app/actions/deleteEvent";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch both data streams in parallel
  const [tickets, organizedEvents] = await Promise.all([
    getTickets(),
    getOrganizerEvents(),
  ]);

  // Simple formatting helper
  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="space-y-12">
          {/* SECTION 1: MY EVENTS (Admin View) */}
          {/* We show this section only if the user has created events */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                My Organized Events
              </h2>
              <Link
                href="/events/create"
                className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                + New Event
              </Link>
            </div>

            {organizedEvents.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                You haven't hosted any events yet.
              </div>
            ) : (
              <div className="divide-y">
                {organizedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Event Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="text-sm text-gray-500 mt-1 flex gap-4">
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{event._count.tickets} tickets sold</span>
                        <span>•</span>
                        <span
                          className={
                            event._count.tickets > 0
                              ? "text-green-600 font-medium"
                              : "text-gray-400"
                          }
                        >
                          $
                          {event._count.tickets *
                            Number(event.ticketVariants[0]?.price || 0)}{" "}
                          earned
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* EDIT BUTTON (Links to a new page we will build next) */}
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit Event"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>

                      {/* DELETE BUTTON */}
                      <form
                        action={async () => {
                          "use server";
                          await deleteEvent(event.id);
                        }}
                      >
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Event"
                          type="submit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: MY TICKETS (User View) */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                My Tickets
              </h2>
            </div>

            {tickets.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No upcoming tickets.{" "}
                <Link href="/" className="text-blue-600 underline">
                  Browse events
                </Link>
                .
              </div>
            ) : (
              <div className="divide-y">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-6 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-bold">{ticket.event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(ticket.event.date)}
                      </p>
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <Link
                        href="/tickets"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View QR Code
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
