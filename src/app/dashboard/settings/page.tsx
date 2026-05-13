import { currentUser } from "@/lib/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await currentUser())!;
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h1 className="font-display text-lg font-bold">Account</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Role</dt>
            <dd>{user.role}</dd>
          </div>
        </dl>
      </section>
      <section className="card p-5">
        <h2 className="font-display text-base font-bold">API access</h2>
        <p className="mt-1 text-sm text-ink-500">REST API & webhook keys for shippers on the Scale plan or above.</p>
        <div className="mt-4 rounded-lg bg-ink-50 p-4 font-mono text-xs">
          <div>POST https://api.fathership.example.com/v1/quotes</div>
          <div className="mt-1 text-ink-500">Authorization: Bearer fs_live_…</div>
        </div>
      </section>
    </div>
  );
}
