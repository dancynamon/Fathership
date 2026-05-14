// Old Dominion (ODFL) LTL rate provider.
//
// Sign up: https://www.odfl.com/Trnsprtl/ — request "Web Services" / API
// access from your ODFL rep once you have a customer account. They issue
// a username/password (used for HTTP Basic auth).
//
// VERIFY: exact endpoint & payload against the developer welcome packet —
// ODFL uses both SOAP and REST flavors of rating; the REST shape below is
// a best-guess starting point.
//
// Env vars used:
//   ODFL_API_BASE       (default https://api.odfl.com)
//   ODFL_USERNAME
//   ODFL_PASSWORD
//   ODFL_ACCOUNT_NUMBER

import { CarrierError, fetchJson, inDollarsCents } from "../http";
import type { RateOption, RateQuoteRequest, RatesProvider } from "../types";

export class OdflProvider implements RatesProvider {
  name = "odfl";

  static isConfigured() {
    return !!(process.env.ODFL_USERNAME && process.env.ODFL_PASSWORD && process.env.ODFL_ACCOUNT_NUMBER);
  }

  async quote(req: RateQuoteRequest): Promise<RateOption[]> {
    if (req.loadType !== "PALLET") return [];
    if (!OdflProvider.isConfigured()) {
      throw new CarrierError(this.name, "Not configured (ODFL_USERNAME/PASSWORD/ACCOUNT_NUMBER)");
    }
    const base = process.env.ODFL_API_BASE ?? "https://api.odfl.com";
    const basic = Buffer.from(`${process.env.ODFL_USERNAME}:${process.env.ODFL_PASSWORD}`).toString("base64");

    // VERIFY: against the ODFL Rate Estimate API docs you receive on onboarding.
    const payload = {
      accountNumber: process.env.ODFL_ACCOUNT_NUMBER,
      shipDate: req.pickupDate.slice(0, 10),
      originPostalCode: req.originZip,
      originCountryCode: "USA",
      destinationPostalCode: req.destZip,
      destinationCountryCode: "USA",
      freight: [
        {
          class: req.freightClass ?? "70",
          weight: req.weightLbs,
          pieces: req.palletCount ?? 1,
          packagingCode: "PLT",
        },
      ],
      accessorials: buildAccessorials(req),
    };

    const data = await fetchJson<OdflResponse>(`${base}/public/rateEstimate`, {
      method: "POST",
      headers: {
        authorization: `Basic ${basic}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
      timeoutMs: 10_000,
      carrier: this.name,
    });

    const r = data.rateEstimate ?? data;
    const base_ = inDollarsCents(r.netFreightCharge ?? r.linehaulCharge);
    const fuel = inDollarsCents(r.fuelSurcharge);
    const acc = inDollarsCents(r.accessorialCharges);
    const total = inDollarsCents(r.totalCharge ?? base_ / 100 + fuel / 100 + acc / 100);

    return [
      {
        carrierName: "Old Dominion",
        carrierLogoSlug: "odfl",
        serviceLabel: "OD Standard LTL",
        transitDays: r.transitDays ?? r.serviceDays ?? 3,
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
  if (req.liftgate) out.push("LFTDEL", "LFTPU");
  if (req.residential) out.push("RESDEL");
  if (req.insidePickup) out.push("IPU");
  if (req.insideDelivery) out.push("IDEL");
  return out;
}

type OdflResponse = {
  rateEstimate?: OdflRate;
} & OdflRate;
type OdflRate = {
  netFreightCharge?: number | string;
  linehaulCharge?: number | string;
  fuelSurcharge?: number | string;
  accessorialCharges?: number | string;
  totalCharge?: number | string;
  transitDays?: number;
  serviceDays?: number;
};
