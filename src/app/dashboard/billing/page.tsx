import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatMoney, formatDate } from "@/lib/utils";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = (await currentUser())!;
  const shipments = await prisma.shipment.findMany({
    where: { shipperId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const total = shipments.reduce((acc, s) => acc + s.totalCents, 0);

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h1 className="font-display text-lg font-bold">Billing summary</h1>
        <p className="mt-2 text-sm text-ink-500">
          NET 7 by default. NET 15/30 available once you{`'`}re booking {`>`}25 loads/mo.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Lifetime spend" value={formatMoney(total)} />
          <Stat label="Shipments" value={String(shipments.length)} />
          <Stat label="Open invoices" value="0" />
          <Stat label="Past due" value="$0" />
        </div>
      </section>
      <section className="card">
        <header className="border-b border-ink-100 p-5">
          <h2 className="font-display text-base font-bold">Invoices</h2>
        </header>
        {shipments.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-500">No invoices yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Shipment</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-mono text-xs">INV-{s.refNumber.replace("FS-", "")}</td>
                  <td className="px-5 py-3 font-mono text-xs">{s.refNumber}</td>
                  <td className="px-5 py-3">{formatDate(s.createdAt)}</td>
                  <td className="px-5 py-3"><span className="chip">Open</span></td>
                  <td className="px-5 py-3 text-right font-semibold">{formatMoney(s.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
