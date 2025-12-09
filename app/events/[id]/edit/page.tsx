// app/events/[id]/edit/page.tsx
import { getEventForEdit } from "@/app/actions/getEventForEdit";
import { updateEvent } from "@/app/actions/updateEvent";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Securely
  const event = await getEventForEdit(id);

  // 2. Handle unauthorized access
  if (!event) {
    redirect("/account"); // Or notFound()
  }

  // Helper to format date for the input (YYYY-MM-DDThh:mm)
  const formatDateForInput = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  // 3. Create a version of the action that includes the ID
  // This "bind" technique passes the event.id automatically when the form submits
  const updateAction = updateEvent.bind(null, event.id);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

      <form action={updateAction} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            name="title"
            type="text"
            defaultValue={event.title}
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={event.description}
            required
            className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              name="date"
              type="datetime-local"
              defaultValue={formatDateForInput(event.date)}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              type="text"
              defaultValue={event.location}
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>

          {/* Cancel Link */}
          <a
            href="/account"
            className="px-6 py-2 rounded border hover:bg-gray-50 text-gray-700 text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
