// MultiProvider: runs N configured carrier providers in parallel, isolates
// failures so one carrier returning 500 doesn't sink the entire quote,
// merges results, applies the central Fathership markup, and sorts by
// total price.

import type { RateOption, RateQuoteRequest, RatesProvider } from "../types";

export class MultiProvider implements RatesProvider {
  name = "multi";

  constructor(private providers: RatesProvider[]) {
    if (providers.length === 0) {
      throw new Error("MultiProvider requires at least one provider");
    }
  }

  async quote(req: RateQuoteRequest): Promise<RateOption[]> {
    const results = await Promise.allSettled(this.providers.map((p) => p.quote(req)));

    const merged: RateOption[] = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const p = this.providers[i];
      if (r.status === "fulfilled") {
        merged.push(...r.value);
      } else {
        console.warn(`[rates] provider ${p.name} failed: ${r.reason?.message ?? r.reason}`);
      }
    }

    // De-duplicate by carrierName + serviceLabel: keep the cheapest one if
    // two providers happen to surface the same carrier (e.g. an aggregator
    // plus a direct integration).
    const byKey = new Map<string, RateOption>();
    for (const opt of merged) {
      const key = `${opt.carrierName}::${opt.serviceLabel}`;
      const existing = byKey.get(key);
      if (!existing || opt.totalCents < existing.totalCents) byKey.set(key, opt);
    }
    return [...byKey.values()].sort((a, b) => a.totalCents - b.totalCents);
  }
}
