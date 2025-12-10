// app/tickets/[id]/page.tsx
import { getTicketById } from "@/app/actions/getTicketById";
import { notFound } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Ticket as TicketIcon,
  ArrowLeft,
  Share2,
  Download,
  Hexagon,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  // Determine status colors
  const statusColors = {
    VALID:
      "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    USED: "bg-slate-700/50 text-slate-400 border-slate-600",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  const statusColor =
    statusColors[ticket.status as keyof typeof statusColors] ||
    statusColors.VALID;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Navigation */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center z-10">
        <Link
          href="/account"
          className="flex items-center text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Wallet
        </Link>
        <div className="flex gap-4">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THE HOLOGRAPHIC TICKET CARD */}
      <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/30 opacity-50 pointer-events-none" />

        {/* 1. Event Header (Top Half) */}
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <div
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${statusColor}`}
            >
              {ticket.status}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight mb-2">
            {ticket.event.title}
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            {new Date(ticket.event.date).toLocaleDateString()} •{" "}
            {new Date(ticket.event.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* 2. Detail Grid (Middle) */}
        <div className="px-6 py-4 bg-black/20 border-y border-white/5 backdrop-blur-sm grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
              Location
            </p>
            <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span className="truncate">{ticket.event.location}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
              Access Type
            </p>
            <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
              <TicketIcon className="w-3 h-3 text-blue-400" />
              <span>{ticket.ticketVariant.name}</span>
            </div>
          </div>
        </div>

        {/* 3. QR Code Scanner Zone (Bottom) */}
        <div className="p-8 bg-black/40 flex flex-col items-center justify-center relative">
          {/* Corner Markers for "Scanner" look */}
          <div className="absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br-lg" />

          {/* QR Wrapper (White background required for contrast) */}
          <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden">
            <QRCodeSVG value={ticket.qrCodeToken} size={180} level="H" />
            {/* Animated Scanner Bar Overlay */}
            {ticket.status === "VALID" && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-[20%] w-full animate-scan pointer-events-none" />
            )}
          </div>

          <p className="mt-6 text-xs text-slate-500 uppercase tracking-[0.2em]">
            Scan for entry
          </p>
          <p className="text-[10px] text-slate-600 font-mono mt-1">
            ID: {ticket.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Decorative Hologram Shine */}
        <div className="absolute -top-[100%] left-[100%] w-full h-full bg-gradient-to-l from-white/5 to-transparent transform -rotate-45 group-hover:top-[100%] group-hover:left-[-100%] transition-all duration-1000 ease-in-out pointer-events-none" />
      </div>
    </div>
  );
}
