const LOGOS = [
  "Old Dominion",
  "Estes",
  "XPO",
  "SAIA",
  "ArcBest",
  "FedEx Freight",
  "R+L Carriers",
  "Knight-Swift",
  "Schneider",
  "Werner",
];

export function LogoCloud() {
  return (
    <section className="border-y border-ink-100 bg-ink-50/60 py-10">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">
          Dispatching across a network of {`>`}1,200 vetted motor carriers
        </p>
        <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-5">
          {LOGOS.map((l) => (
            <span
              key={l}
              className="font-display text-base font-bold uppercase tracking-tight text-ink-400 sm:text-lg"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
