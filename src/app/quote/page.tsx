import { QuoteWizard } from "./QuoteWizard";

export const metadata = { title: "Get an instant quote" };

type Search = { [k: string]: string | string[] | undefined };

export default function QuotePage({ searchParams }: { searchParams: Search }) {
  const initial = {
    loadType: (searchParams.loadType as string) || "PALLET",
    originZip: (searchParams.originZip as string) || "",
    destZip: (searchParams.destZip as string) || "",
    pickupDate:
      (searchParams.pickupDate as string) ||
      new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    weightLbs: (searchParams.weightLbs as string) || "",
    palletCount: (searchParams.palletCount as string) || "1",
    equipment: (searchParams.equipment as string) || "LTL_53",
    serviceLevel: (searchParams.serviceLevel as string) || "STANDARD",
    freightClass: (searchParams.freightClass as string) || "70",
  };
  return (
    <section className="bg-ink-50/40 py-10">
      <div className="container-page">
        <header className="mb-8">
          <span className="chip-brand">Instant quote</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Price a shipment in 60 seconds.
          </h1>
          <p className="mt-2 max-w-2xl text-ink-600">
            Live rates from a vetted carrier network. Standard, guaranteed, and expedited service tiers — all priced up-front.
          </p>
        </header>
        <QuoteWizard initial={initial} />
      </div>
    </section>
  );
}
