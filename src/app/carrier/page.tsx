import { prisma } from "@/lib/db";
import { formatMoney, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/StatusPill";
import { CarrierAcceptButton } from "./CarrierAcceptButton";

export const metadata = { title: "Loadboard" };

export default async function Loadboard() {
  // Available loads = BOOKED with no carrier assigned yet.
  const loads = await prisma.shipment.findMany({
    where: { carrierId: null, status: "BOOKED" },
    orderBy: { pickupDate: "asc" },
    take: 40,
  });

  return (
    <section className="card">
      <header className="flex items-center justify-between border-b border-ink-100 p-5">
        <div>
          <h1 className="font-display text-lg font-bold">Available loads</h1>
          <p className="text-xs text-ink-500">Pre-priced loads matching your equipment & lanes. Pay set by shipper.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="chip">Live</span>
          <span className="chip-ember">{loads.length} open</span>
        </div>
      </header>
      {loads.length === 0 ? (
        <div className="p-10 text-center text-sm text-ink-500">
          No loads on your lanes right now. Check back soon.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Lane</th>
              <th className="px-5 py-3">Equipment</th>
              <th className="px-5 py-3">Pickup</th>
              <th className="px-5 py-3">Weight</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Pay</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loads.map((s) => {
              // Carrier pay = total minus our markup (approx 1 - markup share)
              const payCents = Math.round(s.totalCents * 0.88);
              return (
                <tr key={s.id} className="hover:bg-ink-50">
                  <td className="px-5 py-3 font-mono text-xs">{s.refNumber}</td>
                  <td className="px-5 py-3">{s.originCity}, {s.originState} → {s.destCity}, {s.destState}</td>
                  <td className="px-5 py-3">{s.equipment.replace("_", " ")}</td>
                  <td className="px-5 py-3">{formatDate(s.pickupDate)}</td>
                  <td className="px-5 py-3">{s.weightLbs.toLocaleString()} lbs</td>
                  <td className="px-5 py-3"><StatusPill status={s.status} /></td>
                  <td className="px-5 py-3 text-right font-semibold">{formatMoney(payCents)}</td>
                  <td className="px-5 py-3 text-right">
                    <CarrierAcceptButton shipmentId={s.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
