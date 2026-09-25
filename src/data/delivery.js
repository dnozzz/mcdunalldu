// Mileage-block delivery fees (PHP). Free over FREE_OVER subtotal.
export const FREE_OVER = 500;
export const FLAT_FALLBACK = 49;

// [maxKm, fee]
export const FEE_BLOCKS = [
  [3, 39],
  [5, 59],
  [10, 79],
  [20, 119],
  [30, 159],
  [Infinity, 199],
];

export function havKm(a, b, c, d) {
  const R = 6371;
  const x = ((c - a) * Math.PI) / 180;
  const y = ((d - b) * Math.PI) / 180;
  const h =
    Math.sin(x / 2) ** 2 +
    Math.cos((a * Math.PI) / 180) * Math.cos((c * Math.PI) / 180) * Math.sin(y / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function feeForKm(km) {
  for (const [max, fee] of FEE_BLOCKS) if (km <= max) return fee;
  return 199;
}

// km == null (no branch/location yet) → flat fallback fee
export function deliveryFee(subtotal, km) {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_OVER) return 0;
  if (km == null || Number.isNaN(km)) return FLAT_FALLBACK;
  return feeForKm(km);
}

export function feeLabel(km) {
  if (km == null || Number.isNaN(km)) return "standard rate";
  return `${km.toFixed(1)} km block rate`;
}

export function nearestStore(stores, lat, lon) {
  if (!stores?.length) return null;
  return stores.reduce((best, s) => {
    const d = havKm(lat, lon, s.lat, s.lon);
    return !best || d < best.d ? { ...s, d } : best;
  }, null);
}
