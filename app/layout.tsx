import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Local Host Events",
  description:
    "Secure, fast, and easy event booking platform built with Next.js 15.",
  icons: {
    icon: "/favicon.ico", // You can add a simple emoji as favicon
  },
  openGraph: {
    title: "Local Host Events",
    description: "Join the best tech events.",
    images: ["/og-image.jpg"], // If you added the OG Image feature
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
