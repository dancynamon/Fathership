import { cn } from "@/lib/utils";

export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight", className)}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={mono ? "#0e1218" : "#1f4ef5"} />
              <stop offset="100%" stopColor={mono ? "#0e1218" : "#f97316"} />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#lg)" />
          <path d="M7 22 L13 10 L19 22 L25 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
      <span>fathership</span>
    </span>
  );
}
