"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm({ defaultRole }: { defaultRole: "SHIPPER" | "CARRIER" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
    role: defaultRole,
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Could not sign up");
      }
      router.push(form.role === "CARRIER" ? "/carrier" : "/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <div className="flex gap-2 rounded-lg bg-ink-100 p-1 text-xs font-semibold">
        {(["SHIPPER", "CARRIER"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm((s) => ({ ...s, role: r }))}
            className={`flex-1 rounded-md px-3 py-1.5 ${form.role === r ? "bg-white text-ink-900 shadow-sm" : "text-ink-600"}`}
          >
            {r === "SHIPPER" ? "I ship freight" : "I haul freight"}
          </button>
        ))}
      </div>
      <div>
        <span className="label">Full name</span>
        <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <span className="label">Company</span>
        <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </div>
      <div>
        <span className="label">Work email</span>
        <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <span className="label">Password (min. 8 chars)</span>
        <input className="input" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="btn-brand w-full">
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
