import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (user) {
    await syncUser();
  }

  return (
    <ClerkProvider>
      <html lang="en" className="dark h-full">
        <body
          // 1. Added h-full and removed 'relative' to prevent layout shifting
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden`}
        >
          {/* Background Grid Layer */}
          <div className="fixed inset-0 z-[-1] bg-tech-grid opacity-[0.15] pointer-events-none" />

          {/* 2. FIXED: Background Gradient Orb 
             Added 'w-full max-w-[600px]' so it shrinks on mobile instead of forcing scroll
          */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] md:h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-[-1]" />

          <Header />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
