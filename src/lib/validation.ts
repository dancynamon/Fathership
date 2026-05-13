import { z } from "zod";

export const equipmentEnum = z.enum([
  "DRY_VAN",
  "REEFER",
  "FLATBED",
  "STEP_DECK",
  "HOTSHOT",
  "POWER_ONLY",
  "LTL_53",
  "LTL_28",
]);

export const serviceLevelEnum = z.enum(["STANDARD", "GUARANTEED", "EXPEDITED"]);
export const loadTypeEnum = z.enum(["PALLET", "TRUCKLOAD"]);
export const freightClassEnum = z.enum([
  "50", "55", "60", "65", "70", "77.5", "85", "92.5", "100", "110",
  "125", "150", "175", "200", "250", "300", "400", "500",
]);

export const quoteRequestSchema = z.object({
  loadType: loadTypeEnum,
  originZip: z.string().regex(/^\d{5}$/),
  destZip: z.string().regex(/^\d{5}$/),
  pickupDate: z.string().min(8),
  equipment: equipmentEnum,
  serviceLevel: serviceLevelEnum.default("STANDARD"),
  weightLbs: z.coerce.number().int().positive().max(80_000),
  palletCount: z.coerce.number().int().min(0).max(40).optional(),
  freightClass: freightClassEnum.optional(),
  liftgate: z.coerce.boolean().optional(),
  residential: z.coerce.boolean().optional(),
  insidePickup: z.coerce.boolean().optional(),
  insideDelivery: z.coerce.boolean().optional(),
  commodity: z.string().max(160).optional(),
  declaredValueCents: z.coerce.number().int().nonnegative().optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const bookingSchema = z.object({
  quoteId: z.string().min(5),
  quoteOptionId: z.string().min(5),
  originName: z.string().min(2),
  originAddress: z.string().min(3),
  originCity: z.string().min(2),
  originState: z.string().length(2),
  originContact: z.string().optional(),
  originPhone: z.string().optional(),
  destName: z.string().min(2),
  destAddress: z.string().min(3),
  destCity: z.string().min(2),
  destState: z.string().length(2),
  destContact: z.string().optional(),
  destPhone: z.string().optional(),
  poNumber: z.string().max(60).optional(),
  notes: z.string().max(1000).optional(),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(120),
  name: z.string().min(2).max(120),
  company: z.string().max(120).optional(),
  role: z.enum(["SHIPPER", "CARRIER"]).default("SHIPPER"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
