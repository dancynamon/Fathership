import { estimateMiles } from "../distance";
import type { RateOption, RateQuoteRequest, RatesProvider } from "../types";

// POC pricing model. Loosely calibrated to public LTL & TL benchmarks; not real.
// Replace with direct carrier APIs (XPO, Estes, ODFL, SAIA, ArcBest, FedEx
// Freight) or aggregators (Project44, Banyan) in production.

type CarrierProfile = {
  name: string;
  slug: string;
  serviceLabel: string;
  cpmTL: number;     // cents per mile, truckload
  cpmLTL: number;    // cents per mile, LTL base
  minCharge: number; // cents
  transitBase: number; // days for ~500mi
  transitPerMile: number; // additional days per 1000mi
  fuelPct: number;   // fuel surcharge as % of linehaul
  reliability: number; // 0..1, biases sort
  guaranteedAvailable: boolean;
};

const CARRIERS: CarrierProfile[] = [
  { name: "Old Dominion",       slug: "odfl",   serviceLabel: "Standard LTL",          cpmTL: 250, cpmLTL: 380, minCharge: 13500, transitBase: 2, transitPerMile: 1.2, fuelPct: 0.30, reliability: 0.96, guaranteedAvailable: true },
  { name: "Estes Express",      slug: "estes",  serviceLabel: "Standard LTL",          cpmTL: 240, cpmLTL: 360, minCharge: 12500, transitBase: 2, transitPerMile: 1.3, fuelPct: 0.31, reliability: 0.92, guaranteedAvailable: true },
  { name: "XPO",                slug: "xpo",    serviceLabel: "Rapid Remote LTL",      cpmTL: 245, cpmLTL: 370, minCharge: 13000, transitBase: 2, transitPerMile: 1.2, fuelPct: 0.32, reliability: 0.93, guaranteedAvailable: true },
  { name: "SAIA",               slug: "saia",   serviceLabel: "Standard LTL",          cpmTL: 235, cpmLTL: 345, minCharge: 11800, transitBase: 3, transitPerMile: 1.3, fuelPct: 0.29, reliability: 0.90, guaranteedAvailable: true },
  { name: "ArcBest",            slug: "arcb",   serviceLabel: "Standard LTL",          cpmTL: 248, cpmLTL: 365, minCharge: 12900, transitBase: 3, transitPerMile: 1.3, fuelPct: 0.30, reliability: 0.91, guaranteedAvailable: true },
  { name: "FedEx Freight",      slug: "fxfr",   serviceLabel: "Priority LTL",          cpmTL: 260, cpmLTL: 400, minCharge: 14500, transitBase: 2, transitPerMile: 1.1, fuelPct: 0.33, reliability: 0.94, guaranteedAvailable: true },
  { name: "R+L Carriers",       slug: "rlc",    serviceLabel: "Standard LTL",          cpmTL: 232, cpmLTL: 340, minCharge: 11500, transitBase: 3, transitPerMile: 1.4, fuelPct: 0.29, reliability: 0.88, guaranteedAvailable: false },
  { name: "Knight-Swift",       slug: "knsw",   serviceLabel: "Power-only / Dry Van",  cpmTL: 220, cpmLTL: 0,   minCharge: 0,     transitBase: 1, transitPerMile: 0.9, fuelPct: 0.30, reliability: 0.89, guaranteedAvailable: false },
  { name: "Schneider",          slug: "schn",   serviceLabel: "Truckload Dry Van",     cpmTL: 215, cpmLTL: 0,   minCharge: 0,     transitBase: 1, transitPerMile: 0.9, fuelPct: 0.30, reliability: 0.90, guaranteedAvailable: false },
  { name: "Werner",             slug: "wern",   serviceLabel: "Dedicated TL",          cpmTL: 225, cpmLTL: 0,   minCharge: 0,     transitBase: 1, transitPerMile: 0.95, fuelPct: 0.29, reliability: 0.89, guaranteedAvailable: false },
];

function classMultiplier(fc?: string) {
  // Higher freight class = lower density = higher rate.
  const m: Record<string, number> = {
    "50": 0.78, "55": 0.82, "60": 0.86, "65": 0.90, "70": 0.94, "77.5": 0.98,
    "85": 1.02, "92.5": 1.06, "100": 1.10, "110": 1.18, "125": 1.28, "150": 1.42,
    "175": 1.60, "200": 1.78, "250": 2.05, "300": 2.30, "400": 2.70, "500": 3.10,
  };
  return fc ? (m[fc] ?? 1.1) : 1.1;
}

function serviceMultiplier(level: string) {
  if (level === "EXPEDITED") return 1.55;
  if (level === "GUARANTEED") return 1.18;
  return 1.0;
}

function transitDays(profile: CarrierProfile, miles: number, level: string) {
  const base = profile.transitBase + (miles / 1000) * profile.transitPerMile;
  let days = Math.max(1, Math.round(base));
  if (level === "EXPEDITED") days = Math.max(1, Math.ceil(days / 2));
  if (level === "GUARANTEED") days = Math.max(1, days - 1);
  return days;
}

function accessorialsCents(req: RateQuoteRequest, baseCents: number) {
  let total = 0;
  if (req.liftgate) total += 7500;
  if (req.residential) total += 9500;
  if (req.insidePickup) total += 8500;
  if (req.insideDelivery) total += 8500;
  if (req.loadType === "PALLET" && req.declaredValueCents && req.declaredValueCents > 1000_00) {
    // Excess declared value: ~0.5% of overage
    total += Math.round((req.declaredValueCents - 1000_00) * 0.005);
  }
  // Limited-access bump occasionally based on zip parity for POC
  if (req.destZip.endsWith("9") || req.originZip.endsWith("9")) total += 5500;
  // Min sanity floor: 0
  return Math.max(0, Math.min(total, Math.round(baseCents * 0.6)));
}

function jitter(seed: string, low: number, high: number) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return low + ((h % 10_000) / 10_000) * (high - low);
}

function getMarkup() {
  const raw = process.env.RATES_MARKUP;
  const v = raw ? Number(raw) : 0.1;
  if (!Number.isFinite(v) || v < 0) return 0.1;
  return v;
}

export class MockRatesProvider implements RatesProvider {
  name = "mock";

  async quote(req: RateQuoteRequest): Promise<RateOption[]> {
    const miles = estimateMiles(req.originZip, req.destZip);
    const markup = getMarkup();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24h
    const seedRoot = `${req.originZip}-${req.destZip}-${req.loadType}-${req.equipment}`;
    const isTL = req.loadType === "TRUCKLOAD";

    const eligible = CARRIERS.filter((c) => (isTL ? c.cpmTL > 0 : c.cpmLTL > 0));

    const options = eligible.map<RateOption>((c) => {
      const cpm = isTL ? c.cpmTL : c.cpmLTL;
      // Linehaul. TL is straight $/mile. LTL uses weight + class + mileage proxy.
      let linehaul = 0;
      if (isTL) {
        linehaul = cpm * miles;
      } else {
        const weightFactor = Math.max(1, req.weightLbs / 1000);
        const classMul = classMultiplier(req.freightClass);
        linehaul = cpm * miles * 0.45 + weightFactor * 850 * classMul + (req.palletCount ?? 0) * 1800;
        linehaul = Math.max(linehaul, c.minCharge);
      }
      // Apply service-level multiplier and per-carrier jitter ±5%.
      const svc = serviceMultiplier(req.serviceLevel);
      const j = jitter(seedRoot + c.slug, 0.95, 1.05);
      const baseCents = Math.round(linehaul * svc * j);
      const fuelCents = Math.round(baseCents * c.fuelPct);
      const accCents = accessorialsCents(req, baseCents);
      const subtotal = baseCents + fuelCents + accCents;
      const markupCents = Math.round(subtotal * markup);
      const totalCents = subtotal + markupCents;

      return {
        carrierName: c.name,
        carrierLogoSlug: c.slug,
        serviceLabel: req.serviceLevel === "GUARANTEED" && c.guaranteedAvailable
          ? `${c.serviceLabel} · Guaranteed`
          : req.serviceLevel === "EXPEDITED"
            ? `${c.serviceLabel} · Expedited`
            : c.serviceLabel,
        transitDays: transitDays(c, miles, req.serviceLevel),
        baseCents,
        fuelCents,
        accessorialsCents: accCents,
        markupCents,
        totalCents,
        guaranteed: req.serviceLevel === "GUARANTEED" && c.guaranteedAvailable,
        expiresAt,
      };
    });

    // Sort by total then by reliability (cheapest first, but break ties on quality)
    options.sort((a, b) => a.totalCents - b.totalCents);
    return options;
  }
}
