import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-ink-50/40 px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Sign in to Fathership</h1>
        <p className="mt-1 text-sm text-ink-500">
          New here? <Link href="/signup" className="text-brand-700 hover:underline">Create an account</Link>.
        </p>
        <LoginForm next={searchParams.next} />
      </div>
    </section>
  );
}
