import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"; // <--- 1. ADD THIS IMPORT
import "./globals.css";
import Header from "@/components/Header";
import { syncUser } from "@/app/actions/syncUser";

export const metadata: Metadata = {
  title: "Local Host Events",
  description: "Secure, fast, and easy event booking platform.",
  icons: { icon: "/favicon.ico" },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. MAKE THIS FUNCTION ASYNC
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 3. ADD THIS SYNC LOGIC
  const user = await currentUser();
  if (user) {
    await syncUser(); // This creates the user in DB if they are missing
  }

  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
        >
          {/* Background Grid Layer */}
          <div className="fixed inset-0 z-[-1] bg-tech-grid opacity-[0.15] pointer-events-none" />

          {/* Gradient Orb */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-[-1]" />

          <Header />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
