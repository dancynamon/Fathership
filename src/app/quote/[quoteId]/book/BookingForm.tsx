"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CarrierMark } from "@/components/CarrierMark";
import { formatMoney } from "@/lib/utils";

type Option = {
  id: string;
  carrierName: string;
  carrierLogoSlug: string | null;
  serviceLabel: string;
  transitDays: number;
  totalCents: number;
  baseCents: number;
  fuelCents: number;
  accessorialsCents: number;
  markupCents: number;
};

type Summary = {
  originZip: string;
  destZip: string;
  pickupDate: string;
  weightLbs: number;
  palletCount: number | null;
  loadType: string;
};

const STEPS = ["Pickup", "Delivery", "Reference", "Review"] as const;

export function BookingForm({ quoteId, option, summary }: { quoteId: string; option: Option; summary: Summary }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pickup, setPickup] = useState({
    originName: "",
    originAddress: "",
    originCity: "",
    originState: "",
    originContact: "",
    originPhone: "",
  });
  const [delivery, setDelivery] = useState({
    destName: "",
    destAddress: "",
    destCity: "",
    destState: "",
    destContact: "",
    destPhone: "",
  });
  const [ref, setRef] = useState({ poNumber: "", notes: "" });

  async function submit() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quoteId,
          quoteOptionId: option.id,
          ...pickup,
          ...delivery,
          ...ref,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Could not book shipment");
      }
      const data = await res.json();
      router.push(`/dashboard/shipments/${data.shipment.id}?just=1`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === 0 && !canNext0()) return;
    if (step === 1 && !canNext1()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function canNext0() {
    return pickup.originName && pickup.originAddress && pickup.originCity && pickup.originState.length === 2;
  }
  function canNext1() {
    return delivery.destName && delivery.destAddress && delivery.destCity && delivery.destState.length === 2;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="card p-6">
          <Stepper step={step} />
          <div className="mt-6">
            {step === 0 && (
              <AddressFields
                title="Pickup location"
                hint={`Origin ZIP ${summary.originZip}`}
                values={pickup as any}
                onChange={(k, v) => setPickup((s) => ({ ...s, [k]: v }))}
                nameKey="originName"
                addressKey="originAddress"
                cityKey="originCity"
                stateKey="originState"
                contactKey="originContact"
                phoneKey="originPhone"
              />
            )}
            {step === 1 && (
              <AddressFields
                title="Delivery location"
                hint={`Destination ZIP ${summary.destZip}`}
                values={delivery as any}
                onChange={(k, v) => setDelivery((s) => ({ ...s, [k]: v }))}
                nameKey="destName"
                addressKey="destAddress"
                cityKey="destCity"
                stateKey="destState"
                contactKey="destContact"
                phoneKey="destPhone"
              />
            )}
            {step === 2 && (
              <div>
                <h3 className="font-display text-lg font-bold">Reference numbers</h3>
                <p className="text-sm text-ink-500">Optional, but useful for matching invoices.</p>
                <div className="mt-4 grid gap-3">
                  <div>
                    <span className="label">PO / Reference number</span>
                    <input className="input" value={ref.poNumber} onChange={(e) => setRef({ ...ref, poNumber: e.target.value })} />
                  </div>
                  <div>
                    <span className="label">Special instructions</span>
                    <textarea className="input min-h-[100px]" value={ref.notes} onChange={(e) => setRef({ ...ref, notes: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <Review pickup={pickup} delivery={delivery} ref={ref} summary={summary} option={option} />
            )}
          </div>

          {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="btn-ghost"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-brand">Continue</button>
            ) : (
              <button type="button" onClick={submit} disabled={loading} className="btn-brand">
                {loading ? "Booking…" : `Book for ${formatMoney(option.totalCents)}`}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="card sticky top-20 p-6">
          <div className="flex items-center gap-3">
            <CarrierMark slug={option.carrierLogoSlug ?? undefined} name={option.carrierName} />
            <div>
              <div className="font-semibold">{option.carrierName}</div>
              <div className="text-xs text-ink-500">{option.serviceLabel}</div>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-500">Lane</dt>
            <dd className="text-right">{summary.originZip} → {summary.destZip}</dd>
            <dt className="text-ink-500">Pickup</dt>
            <dd className="text-right">{summary.pickupDate}</dd>
            <dt className="text-ink-500">Transit</dt>
            <dd className="text-right">{option.transitDays} days</dd>
            <dt className="text-ink-500">Weight</dt>
            <dd className="text-right">{summary.weightLbs.toLocaleString()} lbs</dd>
            {summary.palletCount ? (
              <>
                <dt className="text-ink-500">Pallets</dt>
                <dd className="text-right">{summary.palletCount}</dd>
              </>
            ) : null}
          </dl>
          <div className="mt-5 border-t border-ink-100 pt-4">
            <dl className="space-y-1 text-sm">
              <Row k="Linehaul" v={formatMoney(option.baseCents)} />
              <Row k="Fuel surcharge" v={formatMoney(option.fuelCents)} />
              <Row k="Accessorials" v={formatMoney(option.accessorialsCents)} />
              <Row k="Fathership fee" v={formatMoney(option.markupCents)} />
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-display text-xl font-extrabold">{formatMoney(option.totalCents)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STEPS.map((s, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={
                "inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold " +
                (state === "done"
                  ? "bg-brand-600 text-white"
                  : state === "current"
                    ? "bg-ink-900 text-white"
                    : "bg-ink-100 text-ink-500")
              }
            >
              {i + 1}
            </span>
            <span className={state === "todo" ? "text-ink-400" : "text-ink-700"}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink-200" />}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function AddressFields({
  title,
  hint,
  values,
  onChange,
  nameKey,
  addressKey,
  cityKey,
  stateKey,
  contactKey,
  phoneKey,
}: {
  title: string;
  hint: string;
  values: Record<string, string>;
  onChange: (k: string, v: string) => void;
  nameKey: string;
  addressKey: string;
  cityKey: string;
  stateKey: string;
  contactKey: string;
  phoneKey: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <span className="text-xs text-ink-500">{hint}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <span className="label">Business name</span>
          <input className="input" value={values[nameKey]} onChange={(e) => onChange(nameKey, e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <span className="label">Street address</span>
          <input className="input" value={values[addressKey]} onChange={(e) => onChange(addressKey, e.target.value)} />
        </div>
        <div>
          <span className="label">City</span>
          <input className="input" value={values[cityKey]} onChange={(e) => onChange(cityKey, e.target.value)} />
        </div>
        <div>
          <span className="label">State</span>
          <input className="input uppercase" maxLength={2} value={values[stateKey]} onChange={(e) => onChange(stateKey, e.target.value.toUpperCase())} />
        </div>
        <div>
          <span className="label">Contact</span>
          <input className="input" value={values[contactKey]} onChange={(e) => onChange(contactKey, e.target.value)} />
        </div>
        <div>
          <span className="label">Phone</span>
          <input className="input" value={values[phoneKey]} onChange={(e) => onChange(phoneKey, e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function Review({ pickup, delivery, ref, summary, option }: any) {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-lg font-bold">Review &amp; confirm</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Pickup">
          <p className="font-semibold">{pickup.originName}</p>
          <p>{pickup.originAddress}</p>
          <p>{pickup.originCity}, {pickup.originState} {summary.originZip}</p>
          {pickup.originContact && <p className="text-ink-500">{pickup.originContact} · {pickup.originPhone}</p>}
        </Block>
        <Block title="Delivery">
          <p className="font-semibold">{delivery.destName}</p>
          <p>{delivery.destAddress}</p>
          <p>{delivery.destCity}, {delivery.destState} {summary.destZip}</p>
          {delivery.destContact && <p className="text-ink-500">{delivery.destContact} · {delivery.destPhone}</p>}
        </Block>
      </div>
      <Block title="Shipment">
        <p>{summary.loadType === "PALLET" ? `${summary.palletCount} pallet(s)` : "Full truckload"} · {summary.weightLbs.toLocaleString()} lbs</p>
        <p>Pickup {summary.pickupDate} · {option.transitDays}d transit</p>
        {ref.poNumber && <p className="text-ink-500">PO #{ref.poNumber}</p>}
        {ref.notes && <p className="text-ink-500">Notes: {ref.notes}</p>}
      </Block>
      <p className="text-xs text-ink-500">
        By booking, you agree to Fathership{`'`}s broker-shipper terms and authorize a hold for the booked amount.
      </p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-200 p-4 text-sm">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</div>
      {children}
    </div>
  );
}
