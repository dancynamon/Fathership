import Link from "next/link";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatMoney, formatDate } from "@/lib/utils";
import { CarrierMark } from "@/components/CarrierMark";
import { StatusPill } from "@/components/StatusPill";

export const metadata = { title: "Shipments" };

export default async function ShipmentsPage() {
  const user = (await currentUser())!;
  const shipments = await prisma.shipment.findMany({
    where: { shipperId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="card">
      <header className="flex items-center justify-between border-b border-ink-100 p-5">
        <h1 className="font-display text-lg font-bold">All shipments</h1>
        <Link href="/quote" className="btn-outline">+ New shipment</Link>
      </header>
      {shipments.length === 0 ? (
        <div className="p-10 text-center text-sm text-ink-500">No shipments yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Lane</th>
              <th className="px-5 py-3">Carrier</th>
              <th className="px-5 py-3">Pickup</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-ink-50">
                <td className="px-5 py-3">
                  <Link href={`/dashboard/shipments/${s.id}`} className="font-mono font-semibold text-brand-700 hover:underline">
                    {s.refNumber}
                  </Link>
                </td>
                <td className="px-5 py-3">{s.originCity}, {s.originState} → {s.destCity}, {s.destState}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-2">
                    <CarrierMark name={s.carrierName} className="h-6 w-6 text-[9px]" />
                    {s.carrierName}
                  </span>
                </td>
                <td className="px-5 py-3">{formatDate(s.pickupDate)}</td>
                <td className="px-5 py-3"><StatusPill status={s.status} /></td>
                <td className="px-5 py-3 text-right font-semibold">{formatMoney(s.totalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
