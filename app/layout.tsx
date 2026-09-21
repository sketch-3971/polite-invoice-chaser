import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import Vercel Analytics
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production" 
      ? "https://polite-invoice-chaser.vercel.app" 
      : "http://localhost:3000"
  ),
  title: "Polite Invoice Chaser | Get paid without the awkward emails",
  description:
    "Stop stressing over late payments. Our smart assistant drafts the perfect follow-up email. You review it, click approve, and send it straight from your own Gmail.",
  openGraph: {
    // ... your existing openGraph stuff
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* 2. Drop the component right before the closing body tag */}
        <Analytics />
      </body>
    </html>
  );
}