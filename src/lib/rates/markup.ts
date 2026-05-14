import type { RateOption } from "./types";

export function getMarkup() {
  const raw = process.env.RATES_MARKUP;
  const v = raw ? Number(raw) : 0.1;
  if (!Number.isFinite(v) || v < 0) return 0.1;
  return v;
}

// Applies the Fathership service fee on top of raw carrier subtotals.
// Providers should return RateOption with markupCents = 0; this function
// computes the markup and updates totalCents.
export function applyMarkup(options: RateOption[]): RateOption[] {
  const markup = getMarkup();
  return options.map((o) => {
    const subtotal = o.baseCents + o.fuelCents + o.accessorialsCents;
    const markupCents = Math.round(subtotal * markup);
    return {
      ...o,
      markupCents,
      totalCents: subtotal + markupCents,
    };
  });
}
