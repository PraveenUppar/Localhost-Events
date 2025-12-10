import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* --- Brand Logo --- */}
        <Link href="/" className="flex items-center gap-3 group z-40">
          {/* Visual accent square (Always visible) */}
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300" />

          {/* Text Logo (Hidden on very small screens, visible on sm+) */}
          <span className="hidden sm:block text-lg font-bold tracking-tight text-white font-mono group-hover:text-blue-400 transition-colors">
            Local<span className="text-blue-500">Host</span>Events
          </span>
        </Link>

        {/* --- Action Area --- */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SignedIn>
            {/* "My Account" Button - Responsive Variant */}
            <Link
              href="/account"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              {/* Text hidden on mobile, visible on sm+ */}
              <span className="hidden sm:inline">My Account</span>
            </Link>

            {/* Clerk User Button */}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "h-9 w-9 border-2 border-white/10 hover:border-blue-500 transition-colors",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="relative overflow-hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] whitespace-nowrap">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
