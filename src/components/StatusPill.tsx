export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    QUOTED: "bg-ink-100 text-ink-700 border-ink-200",
    BOOKED: "bg-brand-50 text-brand-800 border-brand-200",
    DISPATCHED: "bg-brand-100 text-brand-800 border-brand-200",
    PICKED_UP: "bg-ember-50 text-ember-800 border-ember-200",
    IN_TRANSIT: "bg-ember-100 text-ember-800 border-ember-200",
    DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    CANCELED: "bg-red-50 text-red-800 border-red-200",
    EXCEPTION: "bg-red-100 text-red-800 border-red-200",
  };
  const cls = map[status] ?? "bg-ink-100 text-ink-700 border-ink-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}
