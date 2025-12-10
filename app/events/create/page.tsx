// app/events/create/page.tsx
"use client";

import { createEvent } from "../../actions/createEvent";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface TicketVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function CreateEventPage() {
  // 1. Manage Ticket State
  const [tickets, setTickets] = useState<TicketVariant[]>([
    { id: "1", name: "General Admission", price: 0, stock: 100 },
  ]);

  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Math.random().toString(),
        name: "VIP Access",
        price: 50,
        stock: 20,
      },
    ]);
  };

  const removeTicket = (id: string) => {
    if (tickets.length === 1) return;
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const updateTicket = (id: string, field: keyof TicketVariant, value: any) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Header & Nav */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/account"
              className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Initialize Event
            </h1>
          </div>
        </div>

        <form action={createEvent} className="space-y-8">
          {/* --- SECTION 1: Event Details --- */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Event Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Event Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Future Tech Summit 2025"
                  required
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the mission..."
                  required
                  className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Date & Time
                  </label>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ]scheme-dark"
                  />
                </div>
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Moscone Center, SF"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION 2: Ticket Configuration --- */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white">Access Levels</h2>
              <button
                type="button"
                onClick={addTicket}
                className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> ADD TIER
              </button>
            </div>

            {/* Hidden Input for Server Action */}
            <input
              type="hidden"
              name="ticketVariants"
              value={JSON.stringify(tickets)}
            />

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-end bg-slate-800/30 border border-white/5 p-4 rounded-xl relative group hover:border-white/10 transition-colors"
                >
                  {/* Decorative index number */}
                  <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 -rotate-90">
                    TIER {index + 1}
                  </div>

                  {/* Name */}
                  <div className="md:col-span-5 space-y-1">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider">
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) =>
                        updateTicket(ticket.id, "name", e.target.value)
                      }
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicket(
                          ticket.id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ticket.stock}
                      onChange={(e) =>
                        updateTicket(
                          ticket.id,
                          "stock",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Delete */}
                  <div className="md:col-span-1 flex justify-end md:justify-center">
                    <button
                      type="button"
                      onClick={() => removeTicket(ticket.id)}
                      disabled={tickets.length === 1}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 h-10 w-10 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:scale-[1.01] transition-all transform duration-200"
          >
            Launch Event Protocol
          </button>
        </form>
      </div>
    </div>
  );
}
