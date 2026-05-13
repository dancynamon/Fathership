"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const todayIso = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function QuoteHeroForm() {
  const router = useRouter();
  const [loadType, setLoadType] = useState<"PALLET" | "TRUCKLOAD">("PALLET");
  const [originZip, setOriginZip] = useState("");
  const [destZip, setDestZip] = useState("");
  const [pickupDate, setPickupDate] = useState(todayIso());
  const [weightLbs, setWeightLbs] = useState("");
  const [palletCount, setPalletCount] = useState("1");
  const [loading, setLoading] = useState(false);

  function go(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams({
      loadType,
      originZip: originZip.trim(),
      destZip: destZip.trim(),
      pickupDate,
      weightLbs: weightLbs || "1000",
      palletCount: loadType === "PALLET" ? palletCount : "0",
      equipment: loadType === "PALLET" ? "LTL_53" : "DRY_VAN",
      serviceLevel: "STANDARD",
      freightClass: "70",
    });
    router.push(`/quote?${params.toString()}`);
  }

  return (
    <form
      onSubmit={go}
      className="rounded-2xl border border-white/10 bg-white p-5 text-ink-900 shadow-glow lg:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <SegmentedButton active={loadType === "PALLET"} onClick={() => setLoadType("PALLET")}>
          Pallets / LTL
        </SegmentedButton>
        <SegmentedButton active={loadType === "TRUCKLOAD"} onClick={() => setLoadType("TRUCKLOAD")}>
          Full truckload
        </SegmentedButton>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Pickup ZIP</label>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder="90210"
            value={originZip}
            onChange={(e) => setOriginZip(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Delivery ZIP</label>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder="60606"
            value={destZip}
            onChange={(e) => setDestZip(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Pickup date</label>
          <input
            required
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Total weight (lbs)</label>
          <input
            required
            inputMode="numeric"
            placeholder="2,400"
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value.replace(/[^0-9]/g, ""))}
            className="input"
          />
        </div>
        {loadType === "PALLET" && (
          <div className="col-span-2">
            <label className="label">Pallets</label>
            <input
              required
              inputMode="numeric"
              value={palletCount}
              onChange={(e) => setPalletCount(e.target.value.replace(/[^0-9]/g, ""))}
              className="input"
            />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-brand mt-5 w-full">
        {loading ? "Getting rates…" : "See instant rates"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-500">
        Free, no credit card. Rates valid for 24 hours.
      </p>
    </form>
  );
}

function SegmentedButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-ink-900 text-white shadow-card"
          : "bg-ink-100 text-ink-600 hover:bg-ink-200"
      }`}
    >
      {children}
    </button>
  );
}
