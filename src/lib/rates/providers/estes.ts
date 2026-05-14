// Estes Express LTL rate provider.
//
// Sign up: https://www.estes-express.com/myestes/api  (free with an Estes
// shipper account; they issue an API key + a shipper account number)
//
// Auth: Bearer API key in `apiKey` header (Estes Web Services style).
// Some endpoints use SOAP — this implementation targets the REST rating API.
//
// VERIFY: exact endpoint path and JSON shape against your developer
// onboarding email — Estes has shipped multiple versions.
//
// Env vars used:
//   ESTES_API_BASE          (default https://api.estes-express.com)
//   ESTES_API_KEY
//   ESTES_ACCOUNT_NUMBER

import { CarrierError, fetchJson, inDollarsCents } from "../http";
import type { RateOption, RateQuoteRequest, RatesProvider } from "../types";

export class EstesProvider implements RatesProvider {
  name = "estes";

  static isConfigured() {
    return !!(process.env.ESTES_API_KEY && process.env.ESTES_ACCOUNT_NUMBER);
  }

  async quote(req: RateQuoteRequest): Promise<RateOption[]> {
    if (req.loadType !== "PALLET") return [];
    if (!EstesProvider.isConfigured()) {
      throw new CarrierError(this.name, "Not configured (ESTES_API_KEY/ACCOUNT_NUMBER)");
    }
    const base = process.env.ESTES_API_BASE ?? "https://api.estes-express.com";

    // VERIFY: this payload against current Estes Rate Quote API docs.
    const payload = {
      account: process.env.ESTES_ACCOUNT_NUMBER,
      shipDate: req.pickupDate.slice(0, 10),
      origin: { postalCode: req.originZip, countryCode: "US" },
      destination: { postalCode: req.destZip, countryCode: "US" },
      paymentTerms: "PREPAID",
      commodities: [
        {
          class: req.freightClass ?? "70",
          weight: req.weightLbs,
          pieces: req.palletCount ?? 1,
          packagingType: "PLT",
        },
      ],
      accessorials: buildAccessorials(req),
    };

    const data = await fetchJson<EstesQuoteResponse>(`${base}/v1/rating/ratequote`, {
      method: "POST",
      headers: {
        apiKey: process.env.ESTES_API_KEY!,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
      timeoutMs: 10_000,
      carrier: this.name,
    });

    const q = data.quote ?? data.rateQuote;
    if (!q) return [];

    const base_ = inDollarsCents(q.lineHaulCharge);
    const fuel = inDollarsCents(q.fuelSurcharge);
    const acc = inDollarsCents(q.accessorialCharges);
    const total = inDollarsCents(q.totalCharge ?? base_ / 100 + fuel / 100 + acc / 100);
    return [
      {
        carrierName: "Estes Express",
        carrierLogoSlug: "estes",
        serviceLabel: "Estes Standard LTL",
        transitDays: q.transitDays ?? 3,
        baseCents: base_,
        fuelCents: fuel,
        accessorialsCents: acc,
        markupCents: 0,
        totalCents: total,
        guaranteed: false,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
    ];
  }
}

function buildAccessorials(req: RateQuoteRequest): string[] {
  const out: string[] = [];
  if (req.liftgate) out.push("LGTPU", "LGTDEL");
  if (req.residential) out.push("RESDEL");
  if (req.insidePickup) out.push("INPU");
  if (req.insideDelivery) out.push("INDEL");
  return out;
}

type EstesQuoteResponse = {
  quote?: EstesQuote;
  rateQuote?: EstesQuote;
};
type EstesQuote = {
  lineHaulCharge?: number | string;
  fuelSurcharge?: number | string;
  accessorialCharges?: number | string;
  totalCharge?: number | string;
  transitDays?: number;
};
