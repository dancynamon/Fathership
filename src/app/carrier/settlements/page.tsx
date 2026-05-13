import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatMoney, formatDate } from "@/lib/utils";

export const metadata = { title: "Settlements" };

export default async function Settlements() {
  const user = (await currentUser())!;
  const loads = await prisma.shipment.findMany({
    where: { carrierId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const total = loads.reduce((acc, s) => acc + Math.round(s.totalCents * 0.88), 0);

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h1 className="font-display text-lg font-bold">Settlements</h1>
        <p className="mt-1 text-sm text-ink-500">QuickPay (24h) at 1.5%. NET 14 standard. ACH preferred.</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Lifetime pay" value={formatMoney(total)} />
          <Stat label="Loads completed" value={String(loads.filter((l) => l.status === "DELIVERED").length)} />
          <Stat label="Open" value={String(loads.filter((l) => l.status !== "DELIVERED" && l.status !== "CANCELED").length)} />
          <Stat label="QuickPay eligible" value="100%" />
        </div>
      </section>
      <section className="card">
        <header className="border-b border-ink-100 p-5">
          <h2 className="font-display text-base font-bold">Statements</h2>
        </header>
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-3">Load</th>
              <th className="px-5 py-3">Lane</th>
              <th className="px-5 py-3">Delivered</th>
              <th className="px-5 py-3 text-right">Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loads.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 font-mono text-xs">{s.refNumber}</td>
                <td className="px-5 py-3">{s.originCity}, {s.originState} → {s.destCity}, {s.destState}</td>
                <td className="px-5 py-3">{s.deliveryDate ? formatDate(s.deliveryDate) : "—"}</td>
                <td className="px-5 py-3 text-right font-semibold">{formatMoney(Math.round(s.totalCents * 0.88))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1 font-display text-xl font-extrabold">{value}</p>
    </div>
  );
}
