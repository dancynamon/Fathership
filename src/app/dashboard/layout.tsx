import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/shipments", label: "Shipments" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "CARRIER") redirect("/carrier");

  return (
    <section className="bg-ink-50/40 py-8">
      <div className="container-page grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="card p-4">
            <div className="px-2 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Signed in as</p>
              <p className="mt-1 font-semibold">{user.name}</p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-100">
                  {n.label}
                </Link>
              ))}
            </nav>
            <form action="/api/auth/logout" method="post" className="mt-3 border-t border-ink-100 pt-3">
              <button className="btn-ghost w-full" type="submit" formAction="/api/auth/logout">Sign out</button>
            </form>
          </div>
          <Link href="/quote" className="btn-brand mt-4 w-full">+ New shipment</Link>
        </aside>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
