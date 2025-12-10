// app/account/page.tsx
import { getTickets } from "@/app/actions/getTickets";
import { getOrganizerEvents } from "@/app/actions/getOrganizerEvents";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Ticket,
  Calendar,
  BarChart3,
  Plus,
  QrCode,
} from "lucide-react";
import { deleteEvent } from "@/app/actions/deleteEvent";
import { prisma } from "@/lib/db";
import { getDashboardStats } from "@/app/actions/getDashboardStats";
import Dashboard from "@/components/Dashboard";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAdmin = user?.role === "ADMIN";
  const dashboardStats = isAdmin ? await getDashboardStats() : null;
  const pass_dashboardStats = JSON.parse(JSON.stringify(dashboardStats));

  const tickets = await getTickets();
  const organizedEvents = isAdmin ? await getOrganizerEvents() : [];

  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            My <span className="text-blue-500">Account</span>
          </h1>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-slate-400">
            ID: {userId.slice(0, 8)}...
          </div>
        </div>

        <div className="space-y-12">
          {/* --- SECTION 1: ORGANIZER DASHBOARD (Admin Only) --- */}
          {isAdmin && dashboardStats && (
            <div className="space-y-6">
              {/* Dashboard Stats Container */}
              <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Organizer Analytics
                  </h2>
                </div>

                {/* Pass dark mode styles to Dashboard component via a wrapper or assume it handles dark mode */}
                <Dashboard stats={pass_dashboardStats} />
              </div>

              {/* Organized Events List */}
              <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Managed Events
                  </h2>

                  <div className="flex gap-3">
                    <Link
                      href="/admin/scan"
                      className="text-sm bg-slate-800 text-slate-200 border border-white/10 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" /> Scan Tickets
                    </Link>
                    <Link
                      href="/events/create"
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create Event
                    </Link>
                  </div>
                </div>

                {organizedEvents.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400">
                      You haven't hosted any events yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {organizedEvents.map((event: any) => (
                      <div
                        key={event.id}
                        className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/5 transition-colors group"
                      >
                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-white truncate group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-mono text-slate-500">
                            <span>{formatDate(event.date)}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span className="text-slate-400">
                              {event._count.tickets} sold
                            </span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span
                              className={
                                event._count.tickets > 0
                                  ? "text-green-400"
                                  : "text-slate-500"
                              }
                            >
                              $
                              {event._count.tickets *
                                Number(
                                  event.ticketVariants[0]?.price || 0
                                )}{" "}
                              revenue
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <form
                            action={async () => {
                              "use server";
                              await deleteEvent(event.id);
                            }}
                          >
                            <button
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Event"
                              type="submit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- SECTION 2: MY TICKETS (Visible to Everyone) --- */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Ticket className="w-5 h-5 text-green-400" />
                My Tickets
              </h2>
            </div>

            {tickets.length === 0 ? (
              <div className="p-12 text-center border-t border-white/5">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 mb-4">
                  No upcoming tickets in your wallet.
                </p>
                <Link
                  href="/"
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                >
                  Browse available events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {tickets.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col p-5 rounded-xl border border-white/10 bg-slate-800/20 hover:bg-slate-800/50 hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    {/* Decorative Status Bar on Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1" />

                    <div className="flex justify-between items-start mb-4 pl-3">
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                          {ticket.event.title}
                        </h3>
                        <p className="text-sm text-slate-400 font-mono mt-1">
                          {formatDate(ticket.event.date)}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-mono border bg-green-500/10 text-green-400 border-green-500/20">
                        {ticket.status}
                      </span>
                    </div>

                    <div className="mt-auto pl-3 flex justify-between items-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wider">
                        Standard Access
                      </div>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"
                      >
                        View Pass <Ticket className="w-4 h-4" />
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
