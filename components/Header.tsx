// components/Header.tsx
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <nav className="border-b bg-white p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          Local Host Events
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            {/* <Link
              href="/events/create"
              className="bg-black text-white px-4 py-2 rounded text-sm"
            >
              Create Event
            </Link> */}
            <Link
              href="/account"
              className="bg-black text-white px-4 py-2 rounded text-sm"
            >
              My Account
            </Link>
            <UserButton />
          </SignedIn>

          <SignedOut>
            {/* Visible only when logged out */}
            <SignInButton mode="modal">
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
