import { MockRatesProvider } from "./providers/mock";
import type { RatesProvider } from "./types";

// Carrier-specific providers (xpo, estes, odfl, saia, arcbest, fedex_freight,
// project44) will live alongside ./providers/mock.ts. The selector below picks
// the active provider from RATES_PROVIDER env var.

let _provider: RatesProvider | null = null;

export function getRatesProvider(): RatesProvider {
  if (_provider) return _provider;
  const name = (process.env.RATES_PROVIDER ?? "mock").toLowerCase();
  switch (name) {
    case "mock":
    default:
      _provider = new MockRatesProvider();
  }
  return _provider;
}

export * from "./types";
