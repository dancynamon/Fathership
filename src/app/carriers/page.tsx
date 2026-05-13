import Link from "next/link";
import { SectionHeader } from "@/components/marketing/FeatureGrid";

export const metadata = { title: "For carriers" };

const VALUE = [
  { t: "Drive loaded miles, not phones", b: "Stop trolling load boards. Pre-priced loads on lanes you actually run, hit accept and go." },
  { t: "QuickPay in 24 hours", b: "Same-day BOL upload triggers QuickPay at 1.5%. Standard NET 14 — no factoring required." },
  { t: "Direct dispatch", b: "We send the BOL and shipper contact straight to your driver. No middlemen, no relay calls." },
  { t: "Lane-matching that works", b: "Tell us your trucks and weekly availability. We match outbound and reload at origin." },
];

export default function CarriersPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 py-16 text-white">
        <div className="absolute inset-x-0 -z-10 h-full bg-hero-mesh opacity-70" aria-hidden />
        <div className="container-page">
          <span className="chip-ember">For carriers</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Run your trucks fuller. Get paid faster.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-200">
            Fathership is a carrier-friendly marketplace. Real shippers, fixed prices, and direct dispatch
            — without the games.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup?role=carrier" className="btn-ember">Sign up to haul</Link>
            <Link href="/carrier" className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15">
              See the loadboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Why carriers haul with us" title="Built by ops people who hate broker games." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {VALUE.map((v) => (
              <div key={v.t} className="card p-6">
                <h3 className="font-display text-lg font-bold tracking-tight">{v.t}</h3>
                <p className="mt-2 text-sm text-ink-600">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50/60 py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Onboarding" title="Three forms, one packet, done in a day." />
          <ol className="mt-10 mx-auto max-w-3xl space-y-4 text-sm text-ink-700">
            <li className="card p-5"><strong>1.</strong> Submit MC/DOT number, W-9, COI naming Fathership Logistics as certificate holder.</li>
            <li className="card p-5"><strong>2.</strong> Sign the broker-carrier agreement (electronic, takes 4 minutes).</li>
            <li className="card p-5"><strong>3.</strong> Connect ELD or use our driver app for tracking — your call.</li>
          </ol>
          <div className="mt-8 text-center">
            <Link href="/signup?role=carrier" className="btn-brand">Start carrier setup</Link>
          </div>
        </div>
      </section>
    </>
  );
}
