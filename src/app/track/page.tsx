import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { StatusPill } from "@/components/StatusPill";

export const metadata = { title: "Track a shipment" };

export default async function TrackPage({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = (searchParams.ref ?? "").trim().toUpperCase();
  const shipment = ref
    ? await prisma.shipment.findUnique({
        where: { refNumber: ref },
        include: { events: { orderBy: { createdAt: "asc" } } },
      })
    : null;

  return (
    <section className="bg-ink-50/40 py-10">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Track a shipment</h1>
        <p className="mt-2 text-ink-600">Enter your reference number, e.g. <span className="kbd">FS-ABCDE12</span>.</p>
        <form className="card mt-6 flex gap-3 p-4" action="/track" method="get">
          <input name="ref" defaultValue={ref} placeholder="FS-XXXXXXX" className="input flex-1 uppercase" />
          <button className="btn-brand" type="submit">Track</button>
        </form>

        {ref && !shipment && (
          <div className="card mt-6 p-6 text-sm text-ink-500">No shipment found for {ref}.</div>
        )}
        {shipment && (
          <div className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-lg font-bold">{shipment.refNumber}</div>
                <div className="text-sm text-ink-600">
                  {shipment.originCity}, {shipment.originState} → {shipment.destCity}, {shipment.destState}
                </div>
              </div>
              <StatusPill status={shipment.status} />
            </div>
            <ol className="mt-6 space-y-4 border-l border-ink-200 pl-5">
              {shipment.events.map((e, i) => (
                <li key={e.id} className="relative">
                  <span className={`absolute -left-[27px] top-1 inline-block h-3 w-3 rounded-full ring-4 ring-white ${i === shipment.events.length - 1 ? "bg-brand-600" : "bg-ink-300"}`} />
                  <div className="text-sm font-semibold">{e.status.replace("_", " ")}</div>
                  {e.note && <div className="text-sm text-ink-600">{e.note}</div>}
                  <div className="text-xs text-ink-400">{formatDateTime(e.createdAt)}</div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
