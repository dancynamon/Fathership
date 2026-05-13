import Link from "next/link";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatMoney, formatDate } from "@/lib/utils";
import { CarrierMark } from "@/components/CarrierMark";
import { StatusPill } from "@/components/StatusPill";

export default async function DashboardOverview() {
  const user = (await currentUser())!;
  const [shipments, totals] = await Promise.all([
    prisma.shipment.findMany({
      where: { shipperId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.shipment.aggregate({
      where: { shipperId: user.id },
      _count: true,
      _sum: { totalCents: true },
    }),
  ]);
  const activeCount = await prisma.shipment.count({
    where: { shipperId: user.id, status: { in: ["BOOKED", "DISPATCHED", "PICKED_UP", "IN_TRANSIT"] } },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Active shipments" value={String(activeCount)} />
        <Kpi label="Total booked" value={String(totals._count)} />
        <Kpi label="Lifetime spend" value={formatMoney(totals._sum.totalCents ?? 0)} />
      </div>

      <section className="card">
        <header className="flex items-center justify-between border-b border-ink-100 p-5">
          <h2 className="font-display text-lg font-bold">Recent shipments</h2>
          <Link href="/dashboard/shipments" className="text-sm text-brand-700 hover:underline">View all →</Link>
        </header>
        {shipments.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-500">
            No shipments yet. <Link href="/quote" className="text-brand-700 hover:underline">Get your first quote →</Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {shipments.map((s) => (
              <li key={s.id}>
                <Link href={`/dashboard/shipments/${s.id}`} className="flex items-center gap-4 p-5 hover:bg-ink-50">
                  <CarrierMark name={s.carrierName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">{s.refNumber}</span>
                      <StatusPill status={s.status} />
                    </div>
                    <div className="text-sm text-ink-700">
                      {s.originCity}, {s.originState} → {s.destCity}, {s.destState}
                    </div>
                    <div className="text-xs text-ink-500">
                      {s.carrierName} · Pickup {formatDate(s.pickupDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatMoney(s.totalCents)}</div>
                    <div className="text-xs text-ink-500">{s.weightLbs.toLocaleString()} lbs</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

