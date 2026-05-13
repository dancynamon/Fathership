"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CarrierMark } from "@/components/CarrierMark";
import { formatMoney } from "@/lib/utils";

type Initial = {
  loadType: string;
  originZip: string;
  destZip: string;
  pickupDate: string;
  weightLbs: string;
  palletCount: string;
  equipment: string;
  serviceLevel: string;
  freightClass: string;
};

type Option = {
  id: string;
  carrierName: string;
  carrierLogoSlug?: string | null;
  serviceLabel: string;
  transitDays: number;
  baseCents: number;
  fuelCents: number;
  accessorialsCents: number;
  markupCents: number;
  totalCents: number;
  guaranteed: boolean;
  expiresAt: string;
};

type Quote = { id: string; options: Option[] };

const FREIGHT_CLASSES = ["50", "55", "60", "65", "70", "77.5", "85", "92.5", "100", "110", "125", "150", "175", "200", "250", "300", "400", "500"];

export function QuoteWizard({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [accessorials, setAccessorials] = useState({
    liftgate: false,
    residential: false,
    insidePickup: false,
    insideDelivery: false,
  });
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sort, setSort] = useState<"price" | "speed">("price");

  const isLTL = form.loadType === "PALLET";

  function update<K extends keyof Initial>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          loadType: form.loadType,
          originZip: form.originZip,
          destZip: form.destZip,
          pickupDate: form.pickupDate,
          equipment: form.equipment,
          serviceLevel: form.serviceLevel,
          weightLbs: Number(form.weightLbs || 0),
          palletCount: isLTL ? Number(form.palletCount || 0) : 0,
          freightClass: isLTL ? form.freightClass : undefined,
          ...accessorials,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Could not get rates");
      }
      const data = await res.json();
      setQuote(data.quote);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const options = (quote?.options ?? []).slice();
  if (sort === "speed") options.sort((a, b) => a.transitDays - b.transitDays || a.totalCents - b.totalCents);
  else options.sort((a, b) => a.totalCents - b.totalCents);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form onSubmit={submit} className="card sticky top-20 self-start p-6 lg:col-span-5">
        <Segmented
          value={form.loadType}
          options={[
            { value: "PALLET", label: "Pallet / LTL" },
            { value: "TRUCKLOAD", label: "Full truckload" },
          ]}
          onChange={(v) => {
            update("loadType", v);
            update("equipment", v === "PALLET" ? "LTL_53" : "DRY_VAN");
          }}
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Field label="Pickup ZIP">
            <input
              required pattern="[0-9]{5}" maxLength={5} inputMode="numeric"
              className="input" value={form.originZip} onChange={(e) => update("originZip", e.target.value)}
            />
          </Field>
          <Field label="Delivery ZIP">
            <input
              required pattern="[0-9]{5}" maxLength={5} inputMode="numeric"
              className="input" value={form.destZip} onChange={(e) => update("destZip", e.target.value)}
            />
          </Field>
          <Field label="Pickup date">
            <input
              required type="date" className="input"
              value={form.pickupDate} onChange={(e) => update("pickupDate", e.target.value)}
            />
          </Field>
          <Field label="Service level">
            <select className="input" value={form.serviceLevel} onChange={(e) => update("serviceLevel", e.target.value)}>
              <option value="STANDARD">Standard</option>
              <option value="GUARANTEED">Guaranteed</option>
              <option value="EXPEDITED">Expedited</option>
            </select>
          </Field>

          <Field label="Total weight (lbs)">
            <input
              required inputMode="numeric" className="input"
              value={form.weightLbs}
              onChange={(e) => update("weightLbs", e.target.value.replace(/[^0-9]/g, ""))}
            />
          </Field>
          {isLTL ? (
            <Field label="Pallets">
              <input
                required inputMode="numeric" className="input"
                value={form.palletCount}
                onChange={(e) => update("palletCount", e.target.value.replace(/[^0-9]/g, ""))}
              />
            </Field>
          ) : (
            <Field label="Equipment">
              <select className="input" value={form.equipment} onChange={(e) => update("equipment", e.target.value)}>
                <option value="DRY_VAN">Dry van (53′)</option>
                <option value="REEFER">Reefer</option>
                <option value="FLATBED">Flatbed</option>
                <option value="STEP_DECK">Step deck</option>
                <option value="HOTSHOT">Hotshot</option>
                <option value="POWER_ONLY">Power-only</option>
              </select>
            </Field>
          )}

          {isLTL && (
            <Field label="Freight class">
              <select className="input" value={form.freightClass} onChange={(e) => update("freightClass", e.target.value)}>
                {FREIGHT_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="mt-5">
          <span className="label">Accessorials</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["liftgate", "Liftgate"],
              ["residential", "Residential"],
              ["insidePickup", "Inside pickup"],
              ["insideDelivery", "Inside delivery"],
            ].map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={(accessorials as any)[k]}
                  onChange={(e) => setAccessorials((s) => ({ ...s, [k]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={loading} className="btn-brand mt-6 w-full">
          {loading ? "Getting rates…" : quote ? "Re-quote" : "Get instant rates"}
        </button>
      </form>

      <div className="lg:col-span-7">
        {!quote ? (
          <EmptyState />
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {options.length} carriers on this lane
                </h2>
                <p className="text-xs text-ink-500">
                  {form.originZip} → {form.destZip} · rates valid 24h
                </p>
              </div>
              <Segmented
                value={sort}
                onChange={(v) => setSort(v as any)}
                options={[
                  { value: "price", label: "Cheapest" },
                  { value: "speed", label: "Fastest" },
                ]}
                compact
              />
            </div>
            <ul className="space-y-3">
              {options.map((o) => (
                <li key={o.id} className="card flex flex-wrap items-center gap-4 p-4">
                  <CarrierMark slug={o.carrierLogoSlug ?? undefined} name={o.carrierName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{o.carrierName}</span>
                      {o.guaranteed && <span className="chip-brand">Guaranteed</span>}
                    </div>
                    <div className="text-xs text-ink-500">{o.serviceLabel}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{o.transitDays}d</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500">Transit</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-extrabold">{formatMoney(o.totalCents)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500">All-in</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/quote/${quote.id}/book?optionId=${o.id}`)}
                    className="btn-brand"
                  >
                    Book
                  </button>
                  <details className="w-full text-xs text-ink-600">
                    <summary className="cursor-pointer select-none">Rate breakdown</summary>
                    <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                      <dt>Linehaul</dt><dd className="text-right">{formatMoney(o.baseCents)}</dd>
                      <dt>Fuel surcharge</dt><dd className="text-right">{formatMoney(o.fuelCents)}</dd>
                      <dt>Accessorials</dt><dd className="text-right">{formatMoney(o.accessorialsCents)}</dd>
                      <dt>Fathership service fee</dt><dd className="text-right">{formatMoney(o.markupCents)}</dd>
                      <dt className="font-semibold text-ink-900">Total</dt>
                      <dd className="text-right font-semibold text-ink-900">{formatMoney(o.totalCents)}</dd>
                    </dl>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
  compact = false,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex ${compact ? "gap-1 rounded-lg bg-ink-100 p-1" : "gap-2"}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              compact
                ? `rounded-md px-3 py-1 text-xs font-semibold ${active ? "bg-white text-ink-900 shadow-sm" : "text-ink-600"}`
                : `flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-ink-900 text-white shadow-card" : "bg-ink-100 text-ink-600 hover:bg-ink-200"}`
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex h-full min-h-[440px] flex-col items-center justify-center p-10 text-center text-ink-500">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="14" height="10" rx="1" />
          <path d="M17 9h3l1 3v4h-4M5 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
      <p className="font-semibold text-ink-700">Live carrier rates appear here</p>
      <p className="mt-1 text-sm">Fill in the form to compare instant pricing across {`>`}10 carriers.</p>
    </div>
  );
}
