import Link from "next/link";
import { QuoteHeroForm } from "./QuoteHeroForm";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-hero-mesh opacity-90" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-[0.07]" aria-hidden />
      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <span className="chip-ember inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
            Live carrier marketplace · 1,200+ trucks dispatched today
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Freight, priced in seconds.
            <br />
            Dispatched in minutes.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-200">
            Fathership is the modern 3PL for pallet and truckload shipping. Get
            instant rates from <strong className="text-white">vetted regional and national carriers</strong>, book in one click, and track every mile.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/quote" className="btn-ember">
              Get an instant quote
              <span aria-hidden>→</span>
            </Link>
            <Link href="/how-it-works" className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15">
              See how it works
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            <Stat n="98.4%" l="On-time pickup" />
            <Stat n="< 60s" l="Median quote" />
            <Stat n="$0" l="Setup fees" />
          </dl>
        </div>

        <div className="lg:col-span-5">
          <QuoteHeroForm />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-bold">{n}</dt>
      <dd className="text-xs uppercase tracking-wider text-ink-300">{l}</dd>
    </div>
  );
}
