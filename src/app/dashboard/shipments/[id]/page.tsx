import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { CarrierMark } from "@/components/CarrierMark";
import { StatusPill } from "@/components/StatusPill";

export default async function ShipmentDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { just?: string };
}) {
  const user = (await currentUser())!;
  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: { events: { orderBy: { createdAt: "asc" } }, quote: true },
  });
  if (!shipment || shipment.shipperId !== user.id) return notFound();

  return (
    <div className="space-y-6">
      {searchParams.just && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <strong>Booked.</strong> {shipment.carrierName} is dispatched. We{`'`}ll send tracking updates as the load moves.
        </div>
      )}

      <header className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-lg font-bold">{shipment.refNumber}</h1>
            <StatusPill status={shipment.status} />
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Booked {formatDateTime(shipment.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CarrierMark name={shipment.carrierName} />
          <div>
            <div className="font-semibold">{shipment.carrierName}</div>
            <div className="text-xs text-ink-500">{shipment.serviceLevel}</div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-display text-base font-bold">Tracking timeline</h2>
          <ol className="mt-5 space-y-5 border-l border-ink-200 pl-5">
            {shipment.events.map((e, i) => (
              <li key={e.id} className="relative">
                <span className={`absolute -left-[27px] top-1 inline-block h-3 w-3 rounded-full ring-4 ring-white ${i === shipment.events.length - 1 ? "bg-brand-600" : "bg-ink-300"}`} />
                <div className="text-sm font-semibold">{e.status.replace("_", " ")}</div>
                {e.note && <div className="text-sm text-ink-600">{e.note}</div>}
                {e.location && <div className="text-xs text-ink-500">{e.location}</div>}
                <div className="text-xs text-ink-400">{formatDateTime(e.createdAt)}</div>
              </li>
            ))}
            <li className="relative text-xs text-ink-400">
              <span className="absolute -left-[27px] top-1 inline-block h-3 w-3 rounded-full ring-4 ring-white bg-ink-200" />
              Delivery expected
            </li>
          </ol>
        </section>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="font-display text-base font-bold">Pickup</h2>
            <p className="mt-2 font-semibold">{shipment.originName}</p>
            <p>{shipment.originAddress}</p>
            <p>{shipment.originCity}, {shipment.originState} {shipment.originZip}</p>
            {shipment.originContact && (
              <p className="mt-2 text-xs text-ink-500">{shipment.originContact} · {shipment.originPhone}</p>
            )}
          </section>
          <section className="card p-5">
            <h2 className="font-display text-base font-bold">Delivery</h2>
            <p className="mt-2 font-semibold">{shipment.destName}</p>
            <p>{shipment.destAddress}</p>
            <p>{shipment.destCity}, {shipment.destState} {shipment.destZip}</p>
            {shipment.destContact && (
              <p className="mt-2 text-xs text-ink-500">{shipment.destContact} · {shipment.destPhone}</p>
            )}
          </section>
          <section className="card p-5">
            <h2 className="font-display text-base font-bold">Charges</h2>
            <p className="mt-3 font-display text-2xl font-extrabold">{formatMoney(shipment.totalCents)}</p>
            <p className="text-xs text-ink-500">All-in price · Fathership service fee included</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
