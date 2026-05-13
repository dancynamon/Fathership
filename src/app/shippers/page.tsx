import Link from "next/link";
import { SectionHeader } from "@/components/marketing/FeatureGrid";
import { CTA } from "@/components/marketing/CTA";

export const metadata = { title: "For shippers" };

const VALUE = [
  { t: "Lower freight spend", b: "Live competition across 1,200+ carriers pulls your blended cost-per-mile down 8–15%." },
  { t: "Faster pickup windows", b: "Auto-dispatch to the closest carrier with available equipment. Average accepted in 12 minutes." },
  { t: "Visibility built-in", b: "GPS pings, milestone webhooks, and exception alerts on every shipment. No more 'where is my truck'." },
  { t: "One invoice, clean accounting", b: "We pay carriers, you pay us. Consolidated billing with NET 7/15/30 terms for qualified accounts." },
];

const VERTICALS = [
  ["CPG & food", "Temperature-controlled lanes and food-grade carriers, including reefer-on-demand."],
  ["Manufacturing", "Heavy pallet, oversize, and flatbed expertise for industrial inputs and finished goods."],
  ["E-commerce 3PL", "Hand-off between warehouse pick and pallet delivery, integrated with your WMS."],
  ["Construction", "Job-site deliveries with limited-access and liftgate scheduling out of the box."],
];

export default function ShippersPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60 py-16">
        <div className="container-page">
          <span className="chip-brand">For shippers</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ship pallets and truckloads like the biggest fleets in the country.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">
            Get the leverage of a national 3PL — instant rates, vetted carriers, real tracking, and white-glove
            claims — without the broker calls.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/quote" className="btn-brand">Get instant rates</Link>
            <Link href="/contact" className="btn-outline">Talk to sales</Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Why shippers move to Fathership" title="The 3PL that earns the lane every time." />
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
          <SectionHeader eyebrow="Verticals" title="Specialized lanes for real industries." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VERTICALS.map(([t, b]) => (
              <div key={t} className="card p-6">
                <h3 className="font-display text-base font-bold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm text-ink-600">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
