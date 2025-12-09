import { getEvents } from "./actions/getEvents";
import Link from "next/link";
import Search from "@/components/Search"; // Import the new component

// Receive search params from the URL
export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";

  // Pass the query to the backend
  const events = await getEvents(query);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Tech Events
          </h1>
        </div>

        {/* Add Search Bar Here */}
        <Search />

        {/* Grid Layout (Keep your existing code below) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            // ... (Your existing card code) ...
            const lowestPrice =
              event.ticketVariants.length > 0
                ? Math.min(...event.ticketVariants.map((t) => Number(t.price)))
                : "N/A";

            return (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="block group"
              >
                {/* ... Your existing Card UI ... */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 w-full object-cover relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Image
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {event.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(event.date).toLocaleDateString()} •{" "}
                      {event.location}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        By {event.organizer.name}
                      </span>
                      <span className="font-bold text-lg text-green-700">
                        {lowestPrice === "N/A" ? "Free" : `$${lowestPrice}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No events found matching "{query}".
          </div>
        )}
      </div>
    </main>
  );
}
