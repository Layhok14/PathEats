import PlaceService from "../services/PlaceService.js";
import { catchAsync } from "../utils/catchAsync.js";

const placeService = new PlaceService();

export const getAll = catchAsync(async (req, res) => {
  const places = await placeService.getAll();
  res.json({ success: true, data: places });
});

export const search = catchAsync(async (req, res) => {
  const { routePoints, range, cuisine, maxPrice, openNow, search, limit, offset } = req.body;
  const result = await placeService.search({
    routePoints,
    range,
    cuisine,
    maxPrice,
    openNow,
    search,
    limit,
    offset,
  });
  res.json({ success: true, data: result });
});

export const getScore = catchAsync(async (req, res) => {
  const { price_range, dist_m, rating, wait_time_est } = req.body;

  const final_score =
    0.35 * (1 - (Math.max(1, Math.min(4, price_range || 1)) - 1) / 3) +
    0.30 * (1 - Math.min(dist_m || 0, 300) / 300) +
    0.20 * ((rating || 0) / 5) -
    0.15 * ((wait_time_est || 0) / 15);

  const calculateMetric = (label) => {
    let raw;
    if (label === "affordability") raw = (1 - (Math.max(1, Math.min(4, price_range || 1)) - 1) / 3) * 100;
    else if (label === "proximity") raw = (1 - Math.min(dist_m || 0, 300) / 300) * 100;
    else if (label === "rating") raw = ((rating || 0) / 5) * 100;
    else raw = Math.max(0, 100 - ((wait_time_est || 0) / 15) * 100);
    return { label, score: Math.round(raw) };
  };

  res.json({
    success: true,
    data: {
      final_score: Math.max(0, Math.min(0.85, final_score)),
      overall: Math.round((final_score / 0.85) * 100),
      metrics: [
        calculateMetric("affordability"),
        calculateMetric("proximity"),
        calculateMetric("rating"),
        calculateMetric("wait_time"),
      ],
    },
  });
});

export const getRoute = catchAsync(async (req, res) => {
  const { origin, destination, waypoints } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ success: false, data: { points: [], wasFallback: true } });
  }

  const isValidCoord = (obj) =>
    obj && typeof obj.lat === "number" && typeof obj.lng === "number"
      && isFinite(obj.lat) && isFinite(obj.lng);

  if (!isValidCoord(origin) || !isValidCoord(destination)) {
    return res.json({ success: true, data: { points: [], wasFallback: true } });
  }

  let coords = `${origin.lng},${origin.lat}`;
  if (Array.isArray(waypoints)) {
    for (const wp of waypoints) {
      if (isValidCoord(wp)) coords += `;${wp.lng},${wp.lat}`;
    }
  }
  coords += `;${destination.lng},${destination.lat}`;

  const OSRM_URL = process.env.OSRM_BASE_URL || "https://router.project-osrm.org";
  const url = `${OSRM_URL}/route/v1/driving/${coords}?geometries=geojson&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM HTTP ${response.status}`);
    const data = await response.json();
    if (!data.routes?.length) throw new Error("No route found");

    const pts = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    if (!pts.every((p) => isFinite(p[0]) && isFinite(p[1]))) throw new Error("Route contains NaN");

    res.json({ success: true, data: { points: pts, wasFallback: false } });
  } catch (err) {
    console.warn("[places/route] OSRM unavailable:", err.message);
    const steps = 10;
    const points = Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      const jitter = Math.sin(t * Math.PI) * 0.001;
      return [
        origin.lat + (destination.lat - origin.lat) * t + jitter,
        origin.lng + (destination.lng - origin.lng) * t,
      ];
    });
    res.json({ success: true, data: { points, wasFallback: true } });
  }
});

export const getCount = catchAsync(async (req, res) => {
  const { pool } = await import("../config/db.js");
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM places p
     JOIN users owner_user
       ON owner_user.id = p.owner_id
      AND owner_user.role_scope = 'VENDOR'
      AND owner_user.is_banned = FALSE
     WHERE p.status = 'active'
       AND p.is_open = TRUE`
  );
  res.json({ success: true, data: { total: rows[0].total } });
});

export const getAllReviews = catchAsync(async (req, res) => {
  const { pool } = await import("../config/db.js");
  const { rows } = await pool.query(
    `SELECT r.id, r.rating AS stars, r.body, r.created_at,
            COALESCE(u.first_name || ' ' || u.last_name, 'Anonymous') AS user_name,
            p.name AS place_name, p.id AS place_id
     FROM reviews r
     JOIN places p ON p.id = r.place_id
     JOIN users owner_user
       ON owner_user.id = p.owner_id
      AND owner_user.role_scope = 'VENDOR'
      AND owner_user.is_banned = FALSE
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.deleted_at IS NULL
       AND p.status = 'active'
       AND p.is_open = TRUE
     ORDER BY r.created_at DESC`
  );
  res.json({ success: true, data: rows });
});

export const getById = catchAsync(async (req, res) => {
  const place = await placeService.getById(req.params.id);
  res.json({ success: true, data: place });
});

export const getReviews = catchAsync(async (req, res) => {
  const reviews = await placeService.getReviews(req.params.id);
  res.json({ success: true, data: reviews });
});

export const createReview = catchAsync(async (req, res) => {
  const review = await placeService.createReview(req.params.id, req.user.sub, req.body);
  res.status(201).json({ success: true, data: review });
});

export const updateReview = catchAsync(async (req, res) => {
  const review = await placeService.updateReview(req.params.reviewId, req.user.sub, req.body);
  res.json({ success: true, data: review });
});

export const deleteReview = catchAsync(async (req, res) => {
  await placeService.deleteReview(req.params.reviewId, req.user.sub);
  res.json({ success: true, data: { message: "Review deleted" } });
});
