export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60 py-16">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            We{`'`}re building the operating system for freight.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">
            Fathership is a tech-forward 3PL focused on pallet and truckload freight. We
            combine a vetted carrier marketplace with software that makes quoting, booking,
            and tracking feel like 2026, not 1996.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Why we exist</h2>
            <p className="mt-3 text-ink-700">
              Pallet and truckload shipping is still mostly run on spreadsheets, phone calls,
              and broker emails. The result: shippers overpay by 10–20% and lose visibility
              once the freight rolls. We think every load — from a single pallet to a 53-foot
              dry van — deserves an Uber-style booking experience and end-to-end visibility.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">What we believe</h2>
            <ul className="mt-3 space-y-3 text-ink-700">
              <li><strong>Carriers are partners</strong>, not commodity inputs. We pay fast and don{`'`}t play games with rates.</li>
              <li><strong>Shippers deserve transparency</strong>. Every quote shows linehaul, fuel, accessorials, and our cut.</li>
              <li><strong>Software beats spreadsheets</strong>. Every workflow we touch gets faster, smaller, and more accountable.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
