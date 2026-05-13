export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="container-page grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Talk to us.</h1>
          <p className="mt-3 max-w-md text-ink-600">
            Whether you{`'`}re running 5 pallets a month or 500 loads a week, we{`'`}d love to dig into your lanes.
          </p>
          <dl className="mt-8 space-y-4 text-sm text-ink-700">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Sales</dt>
              <dd>sales@fathership.example.com · (415) 555-0123</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Carrier onboarding</dt>
              <dd>carriers@fathership.example.com · (415) 555-0144</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Operations 24/7</dt>
              <dd>ops@fathership.example.com · (415) 555-0188</dd>
            </div>
          </dl>
        </div>

        <form className="card p-6" action="/api/contact" method="post">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">First name</label>
              <input className="input" name="firstName" required />
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input" name="lastName" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Work email</label>
              <input className="input" type="email" name="email" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Company</label>
              <input className="input" name="company" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">How can we help?</label>
              <textarea className="input min-h-[120px]" name="message" required />
            </div>
          </div>
          <button className="btn-brand mt-5 w-full" type="submit">Send</button>
        </form>
      </div>
    </section>
  );
}
