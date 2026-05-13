import { SectionHeader } from "./FeatureGrid";

const QUOTES = [
  {
    quote:
      "We replaced three brokers with Fathership and cut our pallet spend 14% in the first quarter — without losing a single on-time delivery.",
    name: "Maya Chen",
    title: "Director of Logistics, Northstar Outdoor",
  },
  {
    quote:
      "Quoting used to take 40 minutes of email tag. Now my team books LTL in two clicks and we get tracking pings without asking.",
    name: "Dan Reyes",
    title: "Ops Lead, BrickHouse Brewing",
  },
  {
    quote:
      "Partial truckload was always the worst part of our day. Fathership made it feel like booking an Uber.",
    name: "Jess Park",
    title: "Supply Chain Manager, Lumen Furniture",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader eyebrow="Operators love it" title="Built for shippers who move real freight." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.name} className="card p-6">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-500" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7 7c-2 0-4 2-4 5v5h6v-5H6c0-2 1-3 3-3V7H7zm10 0c-2 0-4 2-4 5v5h6v-5h-3c0-2 1-3 3-3V7h-2z"
                />
              </svg>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink-800">
                {`"`}{q.quote}{`"`}
              </blockquote>
              <figcaption className="mt-4 text-xs">
                <div className="font-semibold text-ink-900">{q.name}</div>
                <div className="text-ink-500">{q.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
