import Link from "next/link";
import { Logo } from "./Logo";
import { currentUser } from "@/lib/session";

const NAV: { href: string; label: string }[] = [
  { href: "/shippers", label: "For shippers" },
  { href: "/carriers", label: "For carriers" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const user = await currentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Fathership home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-700 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-ink-900">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/quote" className="hidden btn-outline sm:inline-flex">
            Get a quote
          </Link>
          {user ? (
            <Link href={user.role === "CARRIER" ? "/carrier" : "/dashboard"} className="btn-brand">
              {user.role === "CARRIER" ? "Loadboard" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link href="/signup" className="btn-brand">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
