import Link from "next/link";
import { SectionHeader } from "@/components/marketing/FeatureGrid";

export const metadata = { title: "Pricing" };

const TIERS = [
  {
    name: "Self-serve",
    price: "Free",
    sub: "Pay only the shipment cost.",
    cta: "Sign up free",
    href: "/signup",
    features: [
      "Instant pallet & truckload rates",
      "Up to 25 shipments / month",
      "Self-serve dashboard & tracking",
      "Email support",
    ],
  },
  {
    name: "Scale",
    price: "$249/mo",
    sub: "For shippers running 25–500 loads/mo.",
    highlight: true,
    cta: "Start a free trial",
    href: "/signup",
    features: [
      "Everything in Self-serve",
      "NET 15 billing terms",
      "Dedicated logistics rep",
      "API & webhooks",
      "Custom carrier rules per lane",
    ],
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    sub: "Pallet + TL volume above 500/mo.",
    cta: "Contact sales",
    href: "/contact",
    features: [
      "Everything in Scale",
      "EDI 204 / 214 / 210",
      "NET 30 + contracted pricing",
      "SLA-backed on-time guarantees",
      "Dedicated account team",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60 py-16">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pricing that scales with you.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">
            No setup fees. No fuel surcharge games. Per-shipment rates are quoted up-front
            with a clean line-item breakdown.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Plans" title="Pick the tier that fits your volume." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`card flex flex-col p-7 ${t.highlight ? "ring-2 ring-brand-500" : ""}`}
              >
                {t.highlight && (
                  <span className="chip-brand mb-3 self-start">Most popular</span>
                )}
                <h3 className="font-display text-xl font-bold tracking-tight">{t.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{t.sub}</p>
                <div className="mt-5 font-display text-3xl font-extrabold">{t.price}</div>
                <ul className="mt-6 space-y-2 text-sm text-ink-700">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.href}
                  className={`mt-7 ${t.highlight ? "btn-brand" : "btn-outline"} w-full`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
