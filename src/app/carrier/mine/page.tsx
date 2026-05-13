import Link from "next/link";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusPill } from "@/components/StatusPill";

export const metadata = { title: "My loads" };

export default async function MyLoads() {
  const user = (await currentUser())!;
  const loads = await prisma.shipment.findMany({
    where: { carrierId: user.id },
    orderBy: { pickupDate: "asc" },
  });
  return (
    <section className="card">
      <header className="flex items-center justify-between border-b border-ink-100 p-5">
        <h1 className="font-display text-lg font-bold">My loads</h1>
        <Link href="/carrier" className="btn-outline">Loadboard</Link>
      </header>
      {loads.length === 0 ? (
        <div className="p-10 text-center text-sm text-ink-500">
          You haven{`'`}t accepted any loads yet.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Lane</th>
              <th className="px-5 py-3">Pickup</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loads.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 font-mono text-xs font-semibold">{s.refNumber}</td>
                <td className="px-5 py-3">{s.originCity}, {s.originState} → {s.destCity}, {s.destState}</td>
                <td className="px-5 py-3">{formatDate(s.pickupDate)}</td>
                <td className="px-5 py-3"><StatusPill status={s.status} /></td>
                <td className="px-5 py-3 text-right font-semibold">{formatMoney(Math.round(s.totalCents * 0.88))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
