import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50/60">
      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-ink-600">
            Pallet and truckload freight, priced in seconds and dispatched on a
            network of vetted regional and national carriers.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="chip">SOC 2 Type II (in progress)</span>
            <span className="chip">USDOT 4321567</span>
            <span className="chip">MC 1234567</span>
          </div>
        </div>
        <FooterCol
          heading="Product"
          links={[
            { href: "/quote", label: "Instant quote" },
            { href: "/shippers", label: "For shippers" },
            { href: "/carriers", label: "For carriers" },
            { href: "/pricing", label: "Pricing" },
            { href: "/track", label: "Track a shipment" },
          ]}
        />
        <FooterCol
          heading="Services"
          links={[
            { href: "/services/ltl", label: "LTL & pallets" },
            { href: "/services/truckload", label: "Full truckload" },
            { href: "/services/expedited", label: "Expedited" },
            { href: "/services/drayage", label: "Drayage" },
            { href: "/services/reefer", label: "Temperature controlled" },
          ]}
        />
        <FooterCol
          heading="Company"
          links={[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/careers", label: "Careers" },
            { href: "/legal/terms", label: "Terms" },
            { href: "/legal/privacy", label: "Privacy" },
          ]}
        />
      </div>
      <div className="border-t border-ink-100 py-6">
        <div className="container-page flex flex-col items-start justify-between gap-3 text-xs text-ink-500 md:flex-row md:items-center">
          <span>&copy; {new Date().getFullYear()} Fathership Logistics, Inc.</span>
          <span>Built on a marketplace of {`>`}1,200 vetted motor carriers.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">{heading}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink-700 hover:text-ink-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
