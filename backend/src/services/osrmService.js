import https from "https";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cache = new Map();

/**
 * Fetch a driving route between origin and destination.
 * @param {number} originLat
 * @param {number} originLng
 * @param {number} destLat
 * @param {number} destLng
 * @returns {Promise<{coordinates: [number,number][], distance: number, duration: number}>}
 */
export function getRoute(originLat, originLng, destLat, destLng) {
  const key = `${originLat.toFixed(5)},${originLng.toFixed(5)}-${destLat.toFixed(5)},${destLng.toFixed(5)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return Promise.resolve(cached.data);

  return new Promise((resolve, reject) => {
    const url = `${OSRM_BASE}/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (json.code !== "Ok" || !json.routes?.length) {
            return reject(new Error("OSRM returned no route"));
          }
          const route = json.routes[0];
          const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const data = { coordinates: coords, distance: route.distance, duration: route.duration };
          cache.set(key, { data, ts: Date.now() });
          resolve(data);
        } catch (err) {
          reject(new Error(`OSRM parse error: ${err.message}`));
        }
      });
    }).on("error", reject);
  });
}
