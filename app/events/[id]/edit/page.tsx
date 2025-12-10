// app/events/[id]/edit/page.tsx

export const dynamic = "force-dynamic";
import { getEventForEdit } from "@/app/actions/getEventForEdit";
import { updateEvent } from "@/app/actions/updateEvent";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Securely
  const event = await getEventForEdit(id);

  // 2. Handle unauthorized access
  if (!event) {
    redirect("/account");
  }

  const formatDateForInput = (date: Date) => {
    // Helper to format date for the input (YYYY-MM-DDThh:mm)
    // We adjust for local timezone offset if needed, or keep simpler ISO slice
    // Ideally, store/manage dates in UTC, but for HTML inputs:
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const updateAction = updateEvent.bind(null, event.id);

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cancel & Return to Dashboard
          </Link>
        </div>

        {/* Main Panel */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="mb-8 border-b border-white/5 pb-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Edit Configuration
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Update event parameters and details.
            </p>
          </div>

          <form action={updateAction} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Event Title
              </label>
              <input
                name="title"
                type="text"
                defaultValue={event.title}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={event.description}
                required
                className="w-full h-40 bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Date & Time
                </label>
                <input
                  name="date"
                  type="datetime-local"
                  defaultValue={formatDateForInput(event.date)}
                  required
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  defaultValue={event.location}
                  required
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-end border-t border-white/5 mt-8">
              <Link
                href="/account"
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Discard Changes
              </Link>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
