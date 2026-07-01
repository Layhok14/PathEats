import { OSRM_BASE_URL } from "../constants/appConfig";
import { interpolateRoute } from "../utils/geoUtils";

function isValidCoord(obj) {
  return obj && typeof obj.lat === "number" && typeof obj.lng === "number"
    && isFinite(obj.lat) && isFinite(obj.lng);
}

const PHNOM_PENH_CENTER = { lat: 11.5564, lng: 104.9282 };

function createFallbackRoute(origin, destination) {
  const validOrigin = isValidCoord(origin) ? origin : PHNOM_PENH_CENTER;
  const validDest = isValidCoord(destination) ? destination : PHNOM_PENH_CENTER;
  
  if (validOrigin.lat === validDest.lat && validOrigin.lng === validDest.lng) {
    const offset = 0.01;
    return interpolateRoute(validOrigin, { 
      lat: validDest.lat + offset, 
      lng: validDest.lng + offset 
    });
  }
  return interpolateRoute(validOrigin, validDest);
}

export async function getRoute(origin, destination, waypoints = []) {
  if (!isValidCoord(origin) || !isValidCoord(destination)) {
    console.warn("[routeService] Invalid origin/destination — using fallback route");
    return { points: createFallbackRoute(origin, destination), wasFallback: true };
  }

  let coords = `${origin.lng},${origin.lat}`;
  for (const wp of waypoints) {
    if (isValidCoord(wp)) coords += `;${wp.lng},${wp.lat}`;
  }
  coords += `;${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?geometries=geojson&overview=full`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.routes?.length) throw new Error("No route found");

    const pts = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    if (!pts.every((p) => isFinite(p[0]) && isFinite(p[1]))) throw new Error("Route contains NaN");
    return { points: pts, wasFallback: false };
  } catch (err) {
    console.warn("[routeService] OSRM unavailable, using interpolated route:", err.message);
    return { points: createFallbackRoute(origin, destination), wasFallback: true };
  }
}
