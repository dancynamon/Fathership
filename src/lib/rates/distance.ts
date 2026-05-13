// Rough zip-to-zip distance for POC purposes.
// Production should use a real mileage provider (PC*MILER, HERE, Google).

// Centroids for the leading digit of US ZIPs (sectional center facilities).
// Coordinates are approximate; good enough for plausible mock pricing.
const ZIP_AREA_CENTROIDS: Record<string, [number, number]> = {
  "0": [42.5, -71.5],   // New England
  "1": [40.8, -74.5],   // NY/NJ/PA east
  "2": [38.0, -77.5],   // DC/VA/MD
  "3": [32.5, -82.5],   // SE
  "4": [40.0, -84.0],   // OH/KY/IN
  "5": [44.5, -91.0],   // Upper Midwest
  "6": [38.8, -92.0],   // Central plains
  "7": [32.0, -96.5],   // TX/AR/LA/OK
  "8": [39.5, -106.5],  // Mountain
  "9": [36.5, -119.5],  // Pacific
};

function centroidFor(zip: string): [number, number] {
  const first = zip?.[0] ?? "5";
  return ZIP_AREA_CENTROIDS[first] ?? ZIP_AREA_CENTROIDS["5"];
}

function haversine(a: [number, number], b: [number, number]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Deterministic jitter from a string seed so repeated quotes for the same lane
// are stable but different lanes vary.
function seedJitter(seed: string, low: number, high: number) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const r = (h % 10_000) / 10_000;
  return low + r * (high - low);
}

export function estimateMiles(originZip: string, destZip: string): number {
  const a = centroidFor(originZip);
  const b = centroidFor(destZip);
  const great = haversine(a, b);
  // Driving distance is typically ~1.18x great-circle in the US.
  const driving = great * 1.18;
  // Add deterministic jitter to keep lanes distinct (±6%)
  const jitter = seedJitter(`${originZip}->${destZip}`, 0.94, 1.06);
  const miles = Math.max(40, Math.round(driving * jitter));
  return miles;
}
