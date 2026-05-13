import Link from "next/link";
import { SectionHeader } from "@/components/marketing/FeatureGrid";

export const metadata = { title: "How it works" };

const FLOW = [
  { n: "01", t: "Quote", b: "Drop pickup ZIP, delivery ZIP, weight, and pallet count. We score every eligible carrier on price, transit, and reliability — in under a minute." },
  { n: "02", t: "Book", b: "Click the rate you want. We generate the BOL, send dispatch to the carrier, and confirm a pickup window in your dashboard." },
  { n: "03", t: "Pick up", b: "Driver arrives in the window. Photo proof of pickup, ELD-backed tracking begins immediately." },
  { n: "04", t: "Track", b: "Mile-by-mile updates and milestone webhooks. Proactive alerts if anything slips." },
  { n: "05", t: "Deliver", b: "POD captured on delivery, exceptions flagged automatically, claims (if any) filed in-app." },
  { n: "06", t: "Settle", b: "One consolidated invoice from Fathership. Carriers paid in 24h via QuickPay; you on NET terms." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60 py-16">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            How Fathership moves your freight.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">
            We replaced the broker-call playbook with software. Here{`'`}s the loop, end to end.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeader eyebrow="The loop" title="Quote, book, deliver — without leaving the app." />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FLOW.map((s) => (
              <li key={s.n} className="card p-6">
                <span className="font-mono text-xs font-semibold tracking-widest text-ember-600">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm text-ink-600">{s.b}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href="/quote" className="btn-brand">Try it — get a live quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
