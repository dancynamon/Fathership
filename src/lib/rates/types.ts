export type LoadType = "PALLET" | "TRUCKLOAD";

export type EquipmentType =
  | "DRY_VAN"
  | "REEFER"
  | "FLATBED"
  | "STEP_DECK"
  | "HOTSHOT"
  | "POWER_ONLY"
  | "LTL_53"
  | "LTL_28";

export type ServiceLevel = "STANDARD" | "GUARANTEED" | "EXPEDITED";

export type FreightClass =
  | "50"
  | "55"
  | "60"
  | "65"
  | "70"
  | "77.5"
  | "85"
  | "92.5"
  | "100"
  | "110"
  | "125"
  | "150"
  | "175"
  | "200"
  | "250"
  | "300"
  | "400"
  | "500";

export interface RateQuoteRequest {
  loadType: LoadType;
  originZip: string;
  destZip: string;
  pickupDate: string; // ISO
  equipment: EquipmentType;
  serviceLevel: ServiceLevel;
  weightLbs: number;
  palletCount?: number;
  freightClass?: FreightClass;
  liftgate?: boolean;
  residential?: boolean;
  insidePickup?: boolean;
  insideDelivery?: boolean;
  declaredValueCents?: number;
}

export interface RateOption {
  carrierName: string;
  carrierLogoSlug?: string;
  serviceLabel: string;
  transitDays: number;
  baseCents: number;
  fuelCents: number;
  accessorialsCents: number;
  markupCents: number;
  totalCents: number;
  guaranteed: boolean;
  expiresAt: string; // ISO
}

export interface RatesProvider {
  name: string;
  quote(req: RateQuoteRequest): Promise<RateOption[]>;
}
