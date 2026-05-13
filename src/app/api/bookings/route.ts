import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { bookingSchema } from "@/lib/validation";
import { shortRef } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  const quote = await prisma.quote.findUnique({
    where: { id: input.quoteId },
    include: { options: true },
  });
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  const option = quote.options.find((o) => o.id === input.quoteOptionId);
  if (!option) return NextResponse.json({ error: "Rate option not found" }, { status: 404 });
  if (option.expiresAt < new Date()) {
    return NextResponse.json({ error: "Rate expired; please re-quote" }, { status: 409 });
  }

  const shipment = await prisma.shipment.create({
    data: {
      refNumber: shortRef(),
      quoteId: quote.id,
      quoteOptionId: option.id,
      shipperId: user.id,
      carrierName: option.carrierName,
      status: "BOOKED",
      loadType: quote.loadType,
      equipment: quote.equipment,
      serviceLevel: quote.serviceLevel,
      originName: input.originName,
      originAddress: input.originAddress,
      originCity: input.originCity,
      originState: input.originState.toUpperCase(),
      originZip: quote.originZip,
      originContact: input.originContact,
      originPhone: input.originPhone,
      destName: input.destName,
      destAddress: input.destAddress,
      destCity: input.destCity,
      destState: input.destState.toUpperCase(),
      destZip: quote.destZip,
      destContact: input.destContact,
      destPhone: input.destPhone,
      pickupDate: quote.pickupDate,
      weightLbs: quote.weightLbs,
      palletCount: quote.palletCount ?? null,
      commodity: quote.commodity ?? null,
      totalCents: option.totalCents,
      poNumber: input.poNumber,
      notes: input.notes,
      events: {
        create: [
          { status: "BOOKED", note: `Booked with ${option.carrierName}` },
        ],
      },
    },
  });

  return NextResponse.json({ shipment });
}
