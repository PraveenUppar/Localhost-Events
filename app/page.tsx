import { getEvents } from "@/app/actions/getEvents";
import Link from "next/link";
import Search from "@/components/Search";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const page = Number(params?.page) || 1;

  const { events, totalCount } = await getEvents(query, page);
  const totalPages = Math.ceil(totalCount / 6);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* 1. HERO SECTION FIX: 
         Added 'overflow-hidden' to the section. 
         This acts as a scissor, cutting off any blur that goes outside the screen width.
      */}
      <section className="relative py-12 md:py-20 text-center overflow-hidden">
        {/* 2. GLOW ORB FIX:
           Added 'max-w-full' to ensure the orb never exceeds screen width 
        */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[300px] bg-blue-500/20 blur-[100px] rounded-full -z-10" />

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Discover the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Future
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Join the most innovative developer conferences, hackathons, and tech
          meetups happening around you.
        </p>

        {/* Search Wrapper with Glow */}
        <div className="max-w-xl mx-auto relative group px-4 sm:px-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative">
            <Search />
          </div>
        </div>
      </section>

      {/* 2. RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event: any) => {
          const lowestPrice =
            event.ticketVariants.length > 0
              ? Math.min(
                  ...event.ticketVariants.map((t: any) => Number(t.price))
                )
              : "N/A";

          return (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="group relative block h-full"
            >
              <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/80 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                {/* Image Area */}
                <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
                    <div className="text-6xl opacity-20">⚡️</div>
                  </div>
                  <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-mono text-white">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs text-slate-500 font-mono">
                      by{" "}
                      <span className="text-slate-300">
                        {event.organizer.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Ticket className="w-3 h-3 text-blue-400" />
                      <span className="font-mono font-bold text-blue-400">
                        {lowestPrice === "N/A" ? "Free" : `$${lowestPrice}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. EMPTY STATE */}
      {events.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
          <p className="text-slate-400">
            No events found matching "
            <span className="text-white">{query}</span>".
          </p>
          <p className="text-slate-600 text-sm mt-2 font-mono">
            Try adjusting your search terms.
          </p>
        </div>
      )}

      {/* 4. PAGINATION */}
      {totalCount > 0 && (
        <div className="mt-8 flex justify-center gap-6 items-center">
          {page > 1 ? (
            <Link
              href={`/?query=${query}&page=${page - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-800 transition-all text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-white/5 rounded-lg text-slate-600 cursor-not-allowed text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          )}

          <span className="font-mono text-sm text-slate-500">
            Page <span className="text-white font-bold">{page}</span> /{" "}
            {totalPages || 1}
          </span>

          {page < totalPages ? (
            <Link
              href={`/?query=${query}&page=${page + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-800 transition-all text-sm font-medium"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-white/5 rounded-lg text-slate-600 cursor-not-allowed text-sm font-medium"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
