const FEATURES = [
  {
    title: "Instant multi-carrier rates",
    body: "Compare priced options from 10+ national LTL and TL carriers side-by-side in under a minute.",
    icon: BoltIcon,
  },
  {
    title: "One-click booking",
    body: "BOL, pickup, and tracking number generated the moment you accept a rate. No phone calls.",
    icon: CursorIcon,
  },
  {
    title: "Real-time tracking",
    body: "Mile-by-mile shipment visibility with status milestones, ELD pings, and proactive exception alerts.",
    icon: PingIcon,
  },
  {
    title: "Claims handled for you",
    body: "Built-in claim filing, photo documentation, and a dedicated logistics rep — first-touch resolution in 48h.",
    icon: ShieldIcon,
  },
  {
    title: "Volume LTL + partial TL",
    body: "Specialized routing for 6–20 pallet shipments that don't fit standard LTL pricing models.",
    icon: PalletIcon,
  },
  {
    title: "API and EDI ready",
    body: "REST API, webhooks, and EDI 204/214/210 for shippers running TMS or ERP integrations.",
    icon: PlugIcon,
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader
          eyebrow="The platform"
          title="A 3PL that finally feels like software."
          subtitle="Fathership replaces freight brokers, rate decks, and tracking emails with one fast workflow."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <f.icon />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">{eyebrow}</span>
      )}
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base text-ink-600">{subtitle}</p>}
    </div>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" strokeLinejoin="round" />
    </svg>
  );
}
function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l7 16 2-7 7-2-16-7z" strokeLinejoin="round" />
    </svg>
  );
}
function PingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M5 12a7 7 0 0114 0M2 12a10 10 0 0120 0" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function PalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="10" rx="1" />
      <path d="M5 18h2M11 18h2M17 18h2M3 16h18" />
    </svg>
  );
}
function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 11-12 0V8zM12 18v4" />
    </svg>
  );
}
