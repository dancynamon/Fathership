import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { BookingForm } from "./BookingForm";

export const metadata = { title: "Book shipment" };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { quoteId: string };
  searchParams: { optionId?: string };
}) {
  const user = await currentUser();
  if (!user) {
    redirect(`/login?next=/quote/${params.quoteId}/book?optionId=${searchParams.optionId ?? ""}`);
  }

  const quote = await prisma.quote.findUnique({
    where: { id: params.quoteId },
    include: { options: true },
  });
  if (!quote) return notFound();
  const option =
    quote.options.find((o) => o.id === searchParams.optionId) ?? quote.options[0];
  if (!option) return notFound();

  return (
    <section className="bg-ink-50/40 py-10">
      <div className="container-page">
        <header className="mb-8">
          <span className="chip-brand">Book shipment</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Confirm pickup &amp; delivery details
          </h1>
          <p className="mt-2 text-ink-600">
            Locking the {option.carrierName} rate at <strong>${(option.totalCents / 100).toFixed(2)}</strong>.
            Rate valid until {new Date(option.expiresAt).toLocaleString()}.
          </p>
        </header>
        <BookingForm
          quoteId={quote.id}
          option={{
            id: option.id,
            carrierName: option.carrierName,
            carrierLogoSlug: option.carrierLogoSlug,
            serviceLabel: option.serviceLabel,
            transitDays: option.transitDays,
            totalCents: option.totalCents,
            baseCents: option.baseCents,
            fuelCents: option.fuelCents,
            accessorialsCents: option.accessorialsCents,
            markupCents: option.markupCents,
          }}
          summary={{
            originZip: quote.originZip,
            destZip: quote.destZip,
            pickupDate: quote.pickupDate.toISOString().slice(0, 10),
            weightLbs: quote.weightLbs,
            palletCount: quote.palletCount,
            loadType: quote.loadType,
          }}
        />
      </div>
    </section>
  );
}
