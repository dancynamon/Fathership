import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoPassword = await bcrypt.hash("demo1234", 10);

  const shipper = await prisma.user.upsert({
    where: { email: "demo@fathership.com" },
    update: {},
    create: {
      email: "demo@fathership.com",
      passwordHash: demoPassword,
      name: "Avery Lin",
      company: "Northstar Outdoor",
      role: "SHIPPER",
    },
  });

  const carrier = await prisma.user.upsert({
    where: { email: "carrier@fathership.com" },
    update: {},
    create: {
      email: "carrier@fathership.com",
      passwordHash: demoPassword,
      name: "Cordillera Trucking LLC",
      company: "Cordillera Trucking LLC",
      role: "CARRIER",
    },
  });

  // Seed one example shipment so the dashboard isn't empty.
  const existing = await prisma.shipment.findFirst({ where: { shipperId: shipper.id } });
  if (!existing) {
    await prisma.shipment.create({
      data: {
        refNumber: "FS-DEMO123",
        shipperId: shipper.id,
        carrierName: "Old Dominion",
        status: "IN_TRANSIT",
        loadType: "PALLET",
        equipment: "LTL_53",
        serviceLevel: "STANDARD",
        originName: "Northstar Outdoor",
        originAddress: "1500 Industrial Way",
        originCity: "Boulder",
        originState: "CO",
        originZip: "80301",
        destName: "RegionalCo Distribution",
        destAddress: "200 Logistics Pkwy",
        destCity: "Chicago",
        destState: "IL",
        destZip: "60606",
        pickupDate: new Date(Date.now() - 86_400_000 * 2),
        weightLbs: 2400,
        palletCount: 3,
        totalCents: 87650,
        events: {
          create: [
            { status: "BOOKED",    note: "Booked with Old Dominion" },
            { status: "DISPATCHED", note: "Carrier dispatched" },
            { status: "PICKED_UP", note: "Pickup confirmed", location: "Boulder, CO" },
            { status: "IN_TRANSIT", note: "Departed Boulder service center", location: "Denver, CO" },
          ],
        },
      },
    });
  }

  // Seed a couple of open loads on the loadboard.
  const openCount = await prisma.shipment.count({ where: { carrierId: null, status: "BOOKED" } });
  if (openCount < 3) {
    await prisma.shipment.createMany({
      data: [
        baseShipment(shipper.id, "FS-LDBD001", "Reno", "NV", "89501", "Salt Lake City", "UT", "84101", 14_000, "DRY_VAN"),
        baseShipment(shipper.id, "FS-LDBD002", "Atlanta", "GA", "30303", "Nashville", "TN", "37201", 22_500, "DRY_VAN"),
        baseShipment(shipper.id, "FS-LDBD003", "Dallas", "TX", "75201", "Memphis", "TN", "38103", 18_800, "REEFER"),
      ],
    });
  }

  console.log("Seeded: shipper=", shipper.email, " carrier=", carrier.email);
}

function baseShipment(
  shipperId: string,
  refNumber: string,
  oc: string, os: string, oz: string,
  dc: string, ds: string, dz: string,
  totalCents: number,
  equipment: "DRY_VAN" | "REEFER",
) {
  return {
    refNumber,
    shipperId,
    carrierName: "Open",
    status: "BOOKED" as const,
    loadType: "TRUCKLOAD" as const,
    equipment,
    serviceLevel: "STANDARD" as const,
    originName: "Distribution Hub",
    originAddress: "1 Industrial Way",
    originCity: oc, originState: os, originZip: oz,
    destName: "Receiving DC",
    destAddress: "1 Logistics Dr",
    destCity: dc, destState: ds, destZip: dz,
    pickupDate: new Date(Date.now() + 86_400_000 * 2),
    weightLbs: 32000,
    palletCount: null,
    totalCents,
  };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
