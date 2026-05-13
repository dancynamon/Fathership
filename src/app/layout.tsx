import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Fathership — Instant pallet & truckload freight",
    template: "%s · Fathership",
  },
  description:
    "Get instant pallet and truckload rates from 1,200+ vetted carriers. Book, dispatch, and track in one place.",
  metadataBase: new URL("https://fathership.example.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink-900">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
