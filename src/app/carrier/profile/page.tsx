import { currentUser } from "@/lib/session";

export const metadata = { title: "Carrier profile" };

export default async function CarrierProfile() {
  const user = (await currentUser())!;
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h1 className="font-display text-lg font-bold">Company profile</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="label">Legal name</dt><dd>{user.name}</dd></div>
          <div><dt className="label">Email</dt><dd>{user.email}</dd></div>
          <div><dt className="label">MC #</dt><dd>—</dd></div>
          <div><dt className="label">DOT #</dt><dd>—</dd></div>
        </dl>
      </section>
      <section className="card p-5">
        <h2 className="font-display text-base font-bold">Equipment</h2>
        <p className="mt-1 text-sm text-ink-500">Tell us your fleet mix and we{`'`}ll match loads automatically.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="chip">Dry van 53′</span>
          <span className="chip">Reefer</span>
          <span className="chip">+ Add equipment</span>
        </div>
      </section>
      <section className="card p-5">
        <h2 className="font-display text-base font-bold">Lane preferences</h2>
        <p className="mt-1 text-sm text-ink-500">We{`'`}ll surface loads on these lanes first.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="From ZIP / state" />
          <input className="input" placeholder="To ZIP / state" />
        </div>
      </section>
    </div>
  );
}
