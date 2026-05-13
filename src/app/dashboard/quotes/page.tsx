import Link from "next/link";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatDate, formatMoney } from "@/lib/utils";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const user = (await currentUser())!;
  const quotes = await prisma.quote.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { options: { orderBy: { totalCents: "asc" }, take: 1 } },
  });
  return (
    <section className="card">
      <header className="flex items-center justify-between border-b border-ink-100 p-5">
        <h1 className="font-display text-lg font-bold">Saved quotes</h1>
        <Link href="/quote" className="btn-outline">+ New quote</Link>
      </header>
      {quotes.length === 0 ? (
        <div className="p-10 text-center text-sm text-ink-500">No quotes yet.</div>
      ) : (
        <ul className="divide-y divide-ink-100">
          {quotes.map((q) => {
            const best = q.options[0];
            return (
              <li key={q.id} className="flex items-center justify-between p-5">
                <div>
                  <div className="text-sm">
                    {q.originZip} → {q.destZip} · {q.loadType} · {formatDate(q.pickupDate)}
                  </div>
                  <div className="text-xs text-ink-500">{formatDate(q.createdAt)} · {q.weightLbs.toLocaleString()} lbs</div>
                </div>
                <div className="flex items-center gap-4">
                  {best && (
                    <div className="text-right">
                      <div className="font-semibold">{formatMoney(best.totalCents)}</div>
                      <div className="text-xs text-ink-500">starting · {best.carrierName}</div>
                    </div>
                  )}
                  <Link href={`/quote/${q.id}/book`} className="btn-brand">Book</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
