"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/createCheckoutSession";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Ticket, Loader2, Sparkles } from "lucide-react";

interface TicketVariant {
  id: string;
  name: string;
  price: number;
  totalStock: number;
}

interface EventTicketCardProps {
  ticketVariants: any[];
}

export default function EventTicketCard({
  ticketVariants,
}: EventTicketCardProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    ticketVariants.length > 0 ? ticketVariants[0].id : null
  );
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedTicket = ticketVariants.find((t) => t.id === selectedTicketId);
  const isSoldOut = selectedTicket && selectedTicket.totalStock <= 0;

  const handleBuy = async () => {
    if (!selectedTicketId) return;
    setIsLoading(true);
    try {
      await createCheckoutSession(selectedTicketId, couponCode);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group/card">
      {/* Glow behind the card */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover/card:opacity-50 transition duration-500"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Ticket className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Select Access Level</h3>
        </div>

        {/* TICKET OPTIONS LIST */}
        <div className="space-y-3 mb-6">
          {ticketVariants.map((variant) => {
            const isSelected = selectedTicketId === variant.id;
            const isVariantSoldOut = variant.totalStock <= 0;

            return (
              <div
                key={variant.id}
                onClick={() =>
                  !isVariantSoldOut && setSelectedTicketId(variant.id)
                }
                className={`
                    relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group
                    ${
                      isVariantSoldOut
                        ? "bg-slate-800/30 border-white/5 opacity-50 cursor-not-allowed grayscale"
                        : isSelected
                        ? "bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                        : "bg-slate-800/40 border-white/10 hover:bg-slate-800 hover:border-white/20"
                    }
                `}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* Custom Radio Circle */}
                    <div
                      className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : "border-slate-600 bg-slate-900/50 group-hover:border-slate-400"
                        }
                        `}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    <div>
                      <span
                        className={`font-medium block text-sm sm:text-base ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {variant.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {isVariantSoldOut ? (
                          <span className="text-red-400 font-bold">
                            SOLD OUT
                          </span>
                        ) : (
                          <span className="text-emerald-400">
                            {variant.totalStock} spots remaining
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-bold font-mono text-lg ${
                      isSelected ? "text-blue-400" : "text-slate-400"
                    }`}
                  >
                    ${Number(variant.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* COUPON INPUT */}
        <div className="mb-6">
          <label className="text-xs font-mono text-slate-500 mb-2 block uppercase tracking-wider">
            Access Code / Coupon
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ENTER CODE"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
            />
            {couponCode && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* BUY BUTTON SECTION */}
        <div className="mt-6">
          <SignedIn>
            <form action={handleBuy}>
              <button
                type="submit"
                disabled={!selectedTicket || isSoldOut || isLoading}
                className="w-full relative overflow-hidden bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group/btn"
              >
                <div className="relative z-10 flex justify-center items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : isSoldOut ? (
                    "MAX CAPACITY REACHED"
                  ) : (
                    <>
                      SECURE TICKET
                      {selectedTicket &&
                        Number(selectedTicket.price) === 0 &&
                        " (FREE)"}
                    </>
                  )}
                </div>

                {/* Shine Animation */}
                {!isSoldOut && !isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                )}
              </button>
            </form>

            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <p className="text-center text-xs text-blue-300 font-mono">
                <span className="font-bold">TIP:</span> Use code "WELCOME2026"
                for 5% off.
              </p>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full bg-slate-800 text-slate-200 py-4 rounded-xl font-semibold border border-white/10 hover:bg-slate-700 hover:text-white hover:border-white/20 transition-all">
                Sign In to Purchase
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600 font-mono">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Encrypted Transaction via Stripe
        </div>
      </div>
    </div>
  );
}
