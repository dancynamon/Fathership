// FedEx Freight (LTL) rate provider.
//
// Developer portal: https://developer.fedex.com  (free; create an account,
// create a project, enable "Rates and Transit Times API")
//
// Auth: OAuth2 client_credentials.
//   POST https://apis.fedex.com/oauth/token      (production)
//   POST https://apis-sandbox.fedex.com/oauth/token (sandbox)
//
// Rate: POST /rate/v1/rates/quotes  with rateRequestType: ["LIST"] (published
// tariff) or ["ACCOUNT"] (your negotiated rates if your account has them).
//
// VERIFY: the exact request/response shape against the latest docs at
// https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html — FedEx
// updates the schema; treat the parsing code below as a starting point.
//
// Env vars used:
//   FEDEX_API_BASE          (default https://apis.fedex.com)
//   FEDEX_CLIENT_ID
//   FEDEX_CLIENT_SECRET
//   FEDEX_ACCOUNT_NUMBER    (your shipper account, required for rating)

import { CarrierError, fetchJson, getOAuthToken, inDollarsCents } from "../http";
import type { RateOption, RateQuoteRequest, RatesProvider } from "../types";

const SERVICE_LABEL_MAP: Record<string, string> = {
  FEDEX_FREIGHT_PRIORITY: "FedEx Freight Priority",
  FEDEX_FREIGHT_ECONOMY: "FedEx Freight Economy",
};

export class FedExFreightProvider implements RatesProvider {
  name = "fedex_freight";

  static isConfigured() {
    return !!(process.env.FEDEX_CLIENT_ID && process.env.FEDEX_CLIENT_SECRET && process.env.FEDEX_ACCOUNT_NUMBER);
  }

  async quote(req: RateQuoteRequest): Promise<RateOption[]> {
    if (req.loadType !== "PALLET") return []; // FedEx Freight = LTL only
    if (!FedExFreightProvider.isConfigured()) {
      throw new CarrierError(this.name, "Not configured (FEDEX_CLIENT_ID/SECRET/ACCOUNT_NUMBER)");
    }
    const base = process.env.FEDEX_API_BASE ?? "https://apis.fedex.com";

    const token = await getOAuthToken({
      carrier: this.name,
      cacheKey: `fedex:${process.env.FEDEX_CLIENT_ID}`,
      tokenUrl: `${base}/oauth/token`,
      clientId: process.env.FEDEX_CLIENT_ID!,
      clientSecret: process.env.FEDEX_CLIENT_SECRET!,
    });

    // VERIFY: payload shape vs. live docs.
    const payload = {
      accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER },
      requestedShipment: {
        shipper: { address: { postalCode: req.originZip, countryCode: "US" } },
        recipient: { address: { postalCode: req.destZip, countryCode: "US" } },
        shipDateStamp: req.pickupDate.slice(0, 10),
        pickupType: "USE_SCHEDULED_PICKUP",
        rateRequestType: ["LIST"],
        serviceType: undefined,
        packagingType: "YOUR_PACKAGING",
        freightShipmentDetail: {
          fedExFreightAccountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
          shippersLoadAndCount: req.palletCount ?? 1,
          totalHandlingUnits: req.palletCount ?? 1,
          lineItems: [
            {
              freightClass: `CLASS_${(req.freightClass ?? "70").replace(".", "_")}`,
              packaging: "PALLET",
              pieces: req.palletCount ?? 1,
              weight: { units: "LB", value: req.weightLbs },
            },
          ],
        },
      },
    };

    const data = await fetchJson<FedExRateResponse>(`${base}/rate/v1/rates/quotes`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        accept: "application/json",
        "x-locale": "en_US",
      },
      body: JSON.stringify(payload),
      timeoutMs: 10_000,
      carrier: this.name,
    });

    const details = data.output?.rateReplyDetails ?? [];
    return details
      .filter((d) => d.serviceType?.includes("FREIGHT"))
      .map<RateOption>((d) => {
        const ship = d.ratedShipmentDetails?.[0];
        const subtotal = inDollarsCents(ship?.totalNetCharge ?? ship?.totalNetFedExCharge);
        const fuel = inDollarsCents(
          ship?.shipmentRateDetail?.surCharges?.find((s) => s.surchargeType === "FUEL")?.amount ?? 0,
        );
        const accessorials = inDollarsCents(
          (ship?.shipmentRateDetail?.surCharges ?? [])
            .filter((s) => s.surchargeType && s.surchargeType !== "FUEL")
            .reduce((a, s) => a + Number(s.amount ?? 0), 0),
        );
        const base = Math.max(0, subtotal - fuel - accessorials);
        const transitDays = parseTransitDays(d.operationalDetail?.transitTime);
        return {
          carrierName: "FedEx Freight",
          carrierLogoSlug: "fxfr",
          serviceLabel: SERVICE_LABEL_MAP[d.serviceType ?? ""] ?? "FedEx Freight",
          transitDays: transitDays ?? 3,
          baseCents: base,
          fuelCents: fuel,
          accessorialsCents: accessorials,
          markupCents: 0,
          totalCents: subtotal,
          guaranteed: false,
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        };
      });
  }
}

function parseTransitDays(t?: string): number | undefined {
  if (!t) return undefined;
  const m = /(\d+)/.exec(t);
  return m ? Number(m[1]) : undefined;
}

// Loose shape — actual fields trimmed; not exhaustive on purpose.
type FedExRateResponse = {
  output?: {
    rateReplyDetails?: Array<{
      serviceType?: string;
      operationalDetail?: { transitTime?: string };
      ratedShipmentDetails?: Array<{
        totalNetCharge?: number | string;
        totalNetFedExCharge?: number | string;
        shipmentRateDetail?: {
          surCharges?: Array<{ surchargeType?: string; amount?: number | string }>;
        };
      }>;
    }>;
  };
};
