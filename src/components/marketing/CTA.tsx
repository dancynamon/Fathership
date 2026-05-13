import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-8 py-16 text-white sm:px-14">
          <div className="absolute inset-0 bg-hero-mesh opacity-80" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Stop emailing brokers for rates.
              </h2>
              <p className="mt-3 max-w-md text-ink-200">
                Spin up a Fathership account in 60 seconds and price your next pallet or full truckload right now.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
              <Link href="/quote" className="btn-ember">
                Get an instant quote
              </Link>
              <Link href="/signup" className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white/15">
                Create a free account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
