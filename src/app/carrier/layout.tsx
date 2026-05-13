import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";

const NAV = [
  { href: "/carrier", label: "Loadboard" },
  { href: "/carrier/mine", label: "My loads" },
  { href: "/carrier/settlements", label: "Settlements" },
  { href: "/carrier/profile", label: "Profile" },
];

export default async function CarrierLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/carrier");
  if (user.role !== "CARRIER" && user.role !== "ADMIN") redirect("/dashboard");

  return (
    <section className="bg-ink-50/40 py-8">
      <div className="container-page grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="card p-4">
            <div className="px-2 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Carrier</p>
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
              <button className="btn-ghost w-full" type="submit">Sign out</button>
            </form>
          </div>
        </aside>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
