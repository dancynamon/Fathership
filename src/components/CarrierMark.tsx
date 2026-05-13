import { cn } from "@/lib/utils";

const PALETTE: Record<string, [string, string]> = {
  odfl: ["#0b3b8c", "#ffffff"],
  estes: ["#bf1e2e", "#ffffff"],
  xpo:   ["#d50f1f", "#ffffff"],
  saia:  ["#0066b3", "#ffffff"],
  arcb:  ["#0e7c3a", "#ffffff"],
  fxfr:  ["#4d148c", "#ff6600"],
  rlc:   ["#1c4d8a", "#ffd200"],
  knsw:  ["#f7a800", "#1b1b1b"],
  schn:  ["#ff6600", "#ffffff"],
  wern:  ["#003b71", "#ffffff"],
};

export function CarrierMark({
  slug,
  name,
  className,
}: {
  slug?: string | null;
  name: string;
  className?: string;
}) {
  const [bg, fg] = (slug && PALETTE[slug]) ?? ["#0e1218", "#ffffff"];
  const initials = name
    .replace(/[^A-Za-z0-9 +]/g, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold leading-none",
        className,
      )}
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      {initials || "FS"}
    </span>
  );
}
