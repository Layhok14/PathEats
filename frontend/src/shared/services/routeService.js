import api from "./axiosService";

function isValidCoord(obj) {
  return obj && typeof obj.lat === "number" && typeof obj.lng === "number"
    && isFinite(obj.lat) && isFinite(obj.lng);
}

export async function getRoute(origin, destination, waypoints = []) {
  if (!isValidCoord(origin) || !isValidCoord(destination)) {
    console.warn("[routeService] Invalid origin/destination — using fallback route");
    return { points: [], wasFallback: true };
  }

  try {
    const { data } = await api.post("/places/route", {
      origin,
      destination,
      waypoints,
    });
    const result = data?.data;
    return { points: result?.points || [], wasFallback: result?.wasFallback ?? true };
  } catch (err) {
    console.warn("[routeService] Backend route unavailable:", err.message);
    return { points: [], wasFallback: true };
  }
}
