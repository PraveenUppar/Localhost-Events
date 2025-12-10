// app/success/page.tsx
import { verifyPurchase } from "@/app/actions/verifyPurchase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, Ticket, ArrowRight, Home } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  const result = await verifyPurchase(session_id);

  if (!result.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Verification Failed
          </h1>
          <p className="text-red-400 mb-6">{result.error}</p>
        </div>
        <Link
          href="/"
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Success Card */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        {/* Animated Checkmark Circle */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full border border-green-500/50 animate-ping opacity-20" />
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
            <Check className="w-8 h-8 text-black stroke-[3]" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Access Granted
        </h1>
        <p className="text-slate-400 mb-8 text-lg">
          Your ticket has been secured.
        </p>

        {/* Receipt / Details Box */}
        <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4 mb-8 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 uppercase font-mono">
              Status
            </span>
            <span className="text-xs text-green-400 font-mono font-bold bg-green-500/10 px-2 py-0.5 rounded">
              CONFIRMED
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase font-mono">
              Transaction ID
            </span>
            <span
              className="text-xs text-slate-300 font-mono truncate max-w-[150px]"
              title={session_id}
            >
              {session_id.slice(-12).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/account"
          className="group w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          View Ticket{" "}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-white transition-colors"
          >
            Return to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
