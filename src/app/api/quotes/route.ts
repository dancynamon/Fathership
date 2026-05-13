import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRatesProvider } from "@/lib/rates";
import { currentUser } from "@/lib/session";
import { quoteRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;
  const provider = getRatesProvider();
  const options = await provider.quote({
    loadType: input.loadType,
    originZip: input.originZip,
    destZip: input.destZip,
    pickupDate: input.pickupDate,
    equipment: input.equipment,
    serviceLevel: input.serviceLevel,
    weightLbs: input.weightLbs,
    palletCount: input.palletCount,
    freightClass: input.freightClass,
    liftgate: input.liftgate,
    residential: input.residential,
    insidePickup: input.insidePickup,
    insideDelivery: input.insideDelivery,
    declaredValueCents: input.declaredValueCents,
  });

  const user = await currentUser();

  const quote = await prisma.quote.create({
    data: {
      userId: user?.id,
      loadType: input.loadType,
      originZip: input.originZip,
      destZip: input.destZip,
      pickupDate: new Date(input.pickupDate),
      equipment: input.equipment,
      serviceLevel: input.serviceLevel,
      weightLbs: input.weightLbs,
      palletCount: input.palletCount,
      freightClass: input.freightClass ?? null,
      commodity: input.commodity,
      declaredValue: input.declaredValueCents ?? null,
      liftgate: !!input.liftgate,
      residential: !!input.residential,
      insidePickup: !!input.insidePickup,
      insideDelivery: !!input.insideDelivery,
      options: {
        create: options.map((o) => ({
          carrierName: o.carrierName,
          carrierLogoSlug: o.carrierLogoSlug,
          serviceLabel: o.serviceLabel,
          transitDays: o.transitDays,
          baseCents: o.baseCents,
          fuelCents: o.fuelCents,
          accessorialsCents: o.accessorialsCents,
          markupCents: o.markupCents,
          totalCents: o.totalCents,
          guaranteed: o.guaranteed,
          expiresAt: new Date(o.expiresAt),
        })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json({ quote });
}
