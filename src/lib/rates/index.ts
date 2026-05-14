import { applyMarkup } from "./markup";
import { EstesProvider } from "./providers/estes";
import { FedExFreightProvider } from "./providers/fedex_freight";
import { MockRatesProvider } from "./providers/mock";
import { MultiProvider } from "./providers/multi";
import { OdflProvider } from "./providers/odfl";
import type { RatesProvider, RateOption, RateQuoteRequest } from "./types";

// Provider selection:
//   RATES_PROVIDER=mock   — built-in mock engine (default; always works)
//   RATES_PROVIDER=live   — every configured direct-carrier provider
//                           (FedEx Freight, Estes, ODFL). Unconfigured
//                           providers are skipped. If NONE are configured,
//                           we fall back to mock so the app keeps working.

let _provider: RatesProvider | null = null;

function buildLiveProvider(): RatesProvider {
  const providers: RatesProvider[] = [];
  if (FedExFreightProvider.isConfigured()) providers.push(new FedExFreightProvider());
  if (EstesProvider.isConfigured()) providers.push(new EstesProvider());
  if (OdflProvider.isConfigured()) providers.push(new OdflProvider());

  if (providers.length === 0) {
    console.warn("[rates] RATES_PROVIDER=live but no carrier creds configured; falling back to mock");
    return new MockRatesProvider();
  }
  console.info(`[rates] live providers active: ${providers.map((p) => p.name).join(", ")}`);
  return new MultiProvider(providers);
}

export function getRatesProvider(): RatesProvider {
  if (_provider) return _provider;
  const name = (process.env.RATES_PROVIDER ?? "mock").toLowerCase();
  switch (name) {
    case "live":
      _provider = buildLiveProvider();
      break;
    case "mock":
    default:
      _provider = new MockRatesProvider();
  }
  return _provider;
}

// Convenience: get fully-priced options (provider + central markup) for any
// request. Use this from API routes so markup logic stays in one place.
export async function quoteWithMarkup(req: RateQuoteRequest): Promise<RateOption[]> {
  const raw = await getRatesProvider().quote(req);
  return applyMarkup(raw);
}

export * from "./types";
