import Link from "next/link";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage({ searchParams }: { searchParams: { role?: string } }) {
  const role = searchParams.role === "carrier" ? "CARRIER" : "SHIPPER";
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-ink-50/40 px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {role === "CARRIER" ? "Sign up to haul" : "Create your Fathership account"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Already have one? <Link href="/login" className="text-brand-700 hover:underline">Sign in</Link>.
        </p>
        <SignupForm defaultRole={role} />
      </div>
    </section>
  );
}
