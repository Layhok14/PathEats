/** Haversine distance in metres — used for geolocation-to-preset matching only. */
export function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180, φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns individual metric scores (0–100) for display breakdown.
 * These are pure display helpers derived from server-computed values.
 */
export function calcMetricScores(priceRange: number, distM: number, rating: number, waitMin: number): { affordability: number; proximity: number; ratingScore: number; waitScore: number } {
  const affordability = Math.round((1 - (Math.max(1, Math.min(4, priceRange || 1)) - 1) / 3) * 100);
  const proximity = Math.round((1 - Math.min(distM || 0, 300) / 300) * 100);
  const ratingScore = Math.round(((rating || 0) / 5) * 100);
  const waitScore = Math.round(Math.max(0, 100 - ((waitMin || 0) / 15) * 100));
  return { affordability, proximity, ratingScore, waitScore };
}

export function scoreColor(score: number): string {
  if (score >= 0.68) return "#10b981";
  if (score >= 0.50) return "#22c55e";
  return "#f97316";
}
