import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user || (user.role !== "CARRIER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Carrier sign-in required" }, { status: 401 });
  }
  const shipment = await prisma.shipment.findUnique({ where: { id: params.id } });
  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (shipment.carrierId) return NextResponse.json({ error: "Already taken" }, { status: 409 });

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: {
      carrierId: user.id,
      status: "DISPATCHED",
      events: { create: { status: "DISPATCHED", note: `Accepted by ${user.name}` } },
    },
  });
  return NextResponse.json({ ok: true });
}
