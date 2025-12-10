import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Brand Logo - Tech Style */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Visual accent square */}
          <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-shadow duration-300" />
          <span className="text-lg font-bold tracking-tight text-white font-mono">
            Local<span className="text-blue-500">Host</span>
          </span>
        </Link>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <SignedIn>
            {/* The styling for "My Account" needs to pop against the dark background */}
            <Link
              href="/account"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all hover:scale-105"
            >
              My Account
            </Link>

            {/* Clerk User Button - Styled to blend in */}
            <div className="pl-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "h-9 w-9 border border-white/20 hover:border-blue-500 transition-colors",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              {/* Primary Call To Action - Glowing Button */}
              <button className="relative overflow-hidden rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                <span className="relative z-10">Sign In</span>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500" />
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
