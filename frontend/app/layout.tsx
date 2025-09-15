import type { Metadata } from "next";

import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuickPolls",
  description: "app to simulate live updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">QuickPolls</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/polls" className="hover:underline">All Polls</Link>
              <Link href="/polls/create" className="hover:underline">Create Poll</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
