import { SectionHeader } from "./FeatureGrid";

const STEPS = [
  {
    n: "01",
    title: "Quote in 60 seconds",
    body: "Enter origin, destination, pallets, and weight. We surface live priced options from a curated carrier network.",
  },
  {
    n: "02",
    title: "Book the rate you want",
    body: "Pick on price, transit, or guaranteed delivery. We auto-generate the BOL and dispatch the carrier instantly.",
  },
  {
    n: "03",
    title: "Track and resolve",
    body: "Every milestone shows up in your dashboard, with proactive exception alerts and built-in claims.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ink-50/60 py-20">
      <div className="container-page">
        <SectionHeader
          eyebrow="How it works"
          title="From quote to delivery, on one screen."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card relative p-7">
              <span className="font-mono text-xs font-semibold tracking-widest text-ember-600">
                STEP {s.n}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
