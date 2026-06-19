import { OSRM_BASE_URL } from "../constants/appConfig";
import { interpolateRoute } from "../utils/geoUtils";

function isValidCoord(obj) {
  return obj && typeof obj.lat === "number" && typeof obj.lng === "number"
    && isFinite(obj.lat) && isFinite(obj.lng);
}

export async function getRoute(origin, destination) {
  if (!isValidCoord(origin) || !isValidCoord(destination)) {
    console.warn("[routeService] Invalid origin/destination — using Phnom Penh center as fallback");
    const pp = { lat: 11.5564, lng: 104.9282 };
    return interpolateRoute(pp, pp);
  }

  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?geometries=geojson&overview=full`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.routes?.length) throw new Error("No route found");

    const pts = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    if (!pts.every((p) => isFinite(p[0]) && isFinite(p[1]))) throw new Error("Route contains NaN");
    return pts;
  } catch (err) {
    console.warn("[routeService] OSRM unavailable, using interpolated route:", err.message);
    return interpolateRoute(origin, destination);
  }
}
