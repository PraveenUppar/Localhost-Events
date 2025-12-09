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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-4">
        <Link
          href="/account"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Account
        </Link>
      </div>

      {/* The Ticket Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Event Header */}
        <div className="bg-black p-6 text-white text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            {ticket.event.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(ticket.event.date).toLocaleDateString()}
          </p>
        </div>

        {/* Ticket Details */}
        <div className="p-6">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Location
                </p>
                <p className="text-gray-900 font-medium">
                  {ticket.event.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TicketIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Ticket Type
                </p>
                <p className="text-gray-900 font-medium">
                  {ticket.ticketVariant.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Time
                </p>
                <p className="text-gray-900 font-medium">
                  {new Date(ticket.event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t-2 border-dashed border-gray-200 pt-8 pb-4 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-xl border-4 border-gray-900 shadow-sm">
              <QRCodeSVG
                value={ticket.qrCodeToken}
                size={200}
                level="H" // High error correction level
              />
            </div>
            <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">
              Scan at Gate
            </p>
            <p className="text-xs text-gray-300 font-mono mt-1">
              {ticket.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Status Footer */}
        <div
          className={`p-4 text-center font-bold text-sm uppercase tracking-wide
          ${
            ticket.status === "VALID"
              ? "bg-green-100 text-green-800"
              : ticket.status === "USED"
              ? "bg-gray-200 text-gray-600"
              : "bg-red-100 text-red-800"
          }`}
        >
          Ticket Status: {ticket.status}
        </div>
      </div>
    </div>
  );
}
