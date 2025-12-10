// app/events/[id]/page.tsx
import { getEventById } from "@/app/actions/getEventById";
import { notFound } from "next/navigation";
import { Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventTicketCard from "@/components/EventTicketCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Dynamic Background Glow based on event ID (randomized feel) */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">Back to Events</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Event Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Image Container with Neon Border */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
              {/* Fallback pattern since we don't have real images yet */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="text-slate-700 font-mono text-sm">
                  [Event Image Placeholder]
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* 2. Header & Description */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-blue-500/50 pl-6">
                {event.description}
              </p>
            </div>

            {/* 3. The "Info HUD" (Heads Up Display) Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Module */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">
                    Date & Time
                  </p>
                  <p className="text-white font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Doors open at 9:00 AM
                  </p>
                </div>
              </div>

              {/* Location Module */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-4 hover:border-purple-500/30 transition-colors">
                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-white font-medium">{event.location}</p>
                  <p className="text-slate-400 text-sm">View on Map</p>
                </div>
              </div>

              {/* Organizer Module */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-4 hover:border-cyan-500/30 transition-colors sm:col-span-2">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">
                    Organizer
                  </p>
                  <p className="text-white font-medium">
                    {event.organizer.name}
                  </p>
                  <Link
                    href="#"
                    className="text-blue-400 text-sm hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Ticket Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EventTicketCard
                ticketVariants={event.ticketVariants.map((variant) => ({
                  ...variant,
                  price: Number(variant.price),
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
