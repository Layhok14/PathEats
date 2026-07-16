import PlaceRepository from "../repositories/PlaceRepository.js";
import AppError from "../utils/AppError.js";
import { scheduleToResponse } from "../utils/placeHours.js";
import { storageImageUrlFromMetadata } from "./storageService.js";

const CATEGORY_TO_CUISINE = {
  "Rice": "Rice",
  "Nom Banh Chok": "Nom Banh Chok",
  "Kuytev": "Kuytev",
  "Nompang": "Nompang",
  "Chek Chen": "Chek Chen",
  "Cafe": "Cafe",
  "Banh Sung": "Banh Sung",
  "Banh Xeo": "Banh Xeo",
  "Others": "Others",
};

const toStorageImage = (row) => {
  if (!row.image_bucket || !row.image_path) return null;

  return {
    bucketName: row.image_bucket,
    objectPath: row.image_path,
    mimeType: row.image_mime_type || null,
    sizeBytes: row.image_size_bytes == null ? undefined : Number(row.image_size_bytes),
    altText: row.image_alt_text || "",
  };
};

class PlaceService {
  constructor() {
    this.placeRepo = new PlaceRepository();
  }

  async search({ routePoints, range, cuisine, maxPrice, openNow, search, limit, offset }) {
    if (!routePoints || routePoints.length < 2) {
      return { vendors: [], total: 0, searchMeta: { total: 0, byName: 0, byMenu: 0 } };
    }

    const result = await this.placeRepo.search({
      routePoints,
      range: range || 800,
      cuisine: cuisine && cuisine !== "All" ? cuisine : null,
      maxPrice: maxPrice !== undefined ? maxPrice : null,
      openNow: openNow !== undefined ? openNow : null,
      search: search || null,
      limit: limit || 1000,
      offset: offset || 0,
    });

    const placeIds = result.rows.map((r) => r.id);
    const menuMap = placeIds.length > 0
      ? await this.placeRepo.getMenuItemsForPlaces(placeIds)
      : {};

    const vendors = result.rows.map((row) => {
      const v = this.toVendor(row, menuMap[row.id] || []);
      const dist_m = parseFloat(row.dist_m) || 0;
      v.dist_m = dist_m;

      // Compute composite score (same formula as frontend: 35% affordability, 30% proximity, 20% rating, -15% wait)
      const priceRange = v.price_range || 1;
      const rating = v.rating || 0;
      v.final_score = Math.max(0, Math.min(0.85,
        0.35 * (1 - (Math.max(1, Math.min(4, priceRange)) - 1) / 3) +
        0.30 * (1 - Math.min(dist_m, 300) / 300) +
        0.20 * (rating / 5) -
        0.15 * (0 / 15) // wait_time_est always 0 currently
      ));

      // Attach search match info if search was active
      if (row.match_by_name !== undefined) {
        v._searchMatch = {
          matchedByName: row.match_by_name === 1,
          matchedMenuItems: Array.isArray(row.matched_menu_items) ? row.matched_menu_items : [],
        };
        v._searchActive = true;
      }
      return v;
    });

    return { vendors, total: result.total, searchMeta: result.searchMeta };
  }

  async getAll() {
    const rows = await this.placeRepo.findAllApproved();
    if (rows.length === 0) return [];
    const placeIds = rows.map((r) => r.id);
    const menuMap = await this.placeRepo.getMenuItemsForPlaces(placeIds);
    return rows.map((row) => this.toVendor(row, menuMap[row.id] || []));
  }

  async getById(id) {
    const row = await this.placeRepo.findById(id);
    if (!row) throw new AppError("Place not found", 404);
    const menu = await this.placeRepo.getMenuItems(id);
    return this.toVendor(row, menu);
  }

  async getReviews(placeId) {
    const place = await this.placeRepo.findById(placeId);
    if (!place) throw new AppError("Place not found", 404);
    return this.placeRepo.getReviews(placeId);
  }

  async createReview(placeId, userId, data) {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }
    const place = await this.placeRepo.findById(placeId);
    if (!place) throw new AppError("Place not found", 404);
    return this.placeRepo.createReview(placeId, userId, data);
  }

  async updateReview(reviewId, userId, data) {
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }
    const review = await this.placeRepo.updateReview(reviewId, userId, data);
    if (!review) throw new AppError("Review not found or you do not have permission to edit it", 404);
    await this.placeRepo.refreshRating(review.vendor_id);
    return review;
  }

  async deleteReview(reviewId, userId) {
    const review = await this.placeRepo.deleteReview(reviewId, userId);
    if (!review) throw new AppError("Review not found or you do not have permission to delete it", 404);
    await this.placeRepo.refreshRating(review.place_id);
    return review;
  }

  calculateScore({ price_range, dist_m, rating, wait_time_est }) {
    const finalScore =
      0.35 * (1 - (Math.max(1, Math.min(4, price_range || 1)) - 1) / 3) +
      0.30 * (1 - Math.min(dist_m || 0, 300) / 300) +
      0.20 * ((rating || 0) / 5) -
      0.15 * ((wait_time_est || 0) / 15);

    const metric = (label) => {
      let raw;
      if (label === "affordability") raw = (1 - (Math.max(1, Math.min(4, price_range || 1)) - 1) / 3) * 100;
      else if (label === "proximity") raw = (1 - Math.min(dist_m || 0, 300) / 300) * 100;
      else if (label === "rating") raw = ((rating || 0) / 5) * 100;
      else raw = Math.max(0, 100 - ((wait_time_est || 0) / 15) * 100);
      return { label, score: Math.round(raw) };
    };

    return {
      final_score: Math.max(0, Math.min(0.85, finalScore)),
      overall: Math.round((finalScore / 0.85) * 100),
      metrics: ["affordability", "proximity", "rating", "wait_time"].map(metric),
    };
  }

  async getRoute({ origin, destination, waypoints }) {
    if (!origin || !destination) throw new AppError("origin and destination are required", 400);
    const isValidCoordinate = (value) =>
      value && typeof value.lat === "number" && typeof value.lng === "number" &&
      Number.isFinite(value.lat) && Number.isFinite(value.lng) &&
      value.lat >= -90 && value.lat <= 90 && value.lng >= -180 && value.lng <= 180;
    if (!isValidCoordinate(origin) || !isValidCoordinate(destination)) {
      throw new AppError("Origin and destination coordinates are invalid", 400);
    }

    const routeCoordinates = [origin, ...(Array.isArray(waypoints) ? waypoints.filter(isValidCoordinate) : []), destination]
      .map(({ lng, lat }) => `${lng},${lat}`)
      .join(";");
    const baseUrl = process.env.OSRM_BASE_URL || "https://router.project-osrm.org";
    try {
      const response = await fetch(`${baseUrl}/route/v1/driving/${routeCoordinates}?geometries=geojson&overview=full`);
      if (!response.ok) throw new Error(`OSRM HTTP ${response.status}`);
      const data = await response.json();
      if (!data.routes?.length) throw new Error("No route found");
      const points = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      if (!points.every(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng))) {
        throw new Error("Route contains invalid coordinates");
      }
      return { points, wasFallback: false };
    } catch (error) {
      console.warn("[PlaceService] OSRM unavailable:", error.message);
      const points = Array.from({ length: 11 }, (_, index) => {
        const progress = index / 10;
        const jitter = Math.sin(progress * Math.PI) * 0.001;
        return [
          origin.lat + (destination.lat - origin.lat) * progress + jitter,
          origin.lng + (destination.lng - origin.lng) * progress,
        ];
      });
      return { points, wasFallback: true };
    }
  }

  getCount() {
    return this.placeRepo.countPublicPlaces();
  }

  getAllReviews() {
    return this.placeRepo.getAllPublicReviews();
  }

  toVendor(row, menu) {
    const storageImage = toStorageImage(row);
    return {
      id: row.id,
      name: row.name,
      cuisine: CATEGORY_TO_CUISINE[row.category_name] || row.category_name || "Other",
      price_range: row.price_range || 1,
      rating: parseFloat(row.rating) || 0,
      rating_count: row.rating_count || 0,
      wait_time_est: 0,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      photo_url: storageImageUrlFromMetadata(storageImage) || row.photo_url || "",
      storage_image: storageImage,
      description: row.description || "",
      open_now: row.open_now,
      hours: scheduleToResponse(row.operating_hours),
      address: row.address || "",
      menu: menu.map((m) => {
        const menuStorageImage = toStorageImage(m);
        return {
          name: m.name,
          price: parseFloat(m.price),
          desc: m.description || undefined,
          category: m.category || undefined,
          image_url: storageImageUrlFromMetadata(menuStorageImage) || m.image_url || undefined,
          storage_image: menuStorageImage,
        };
      }),
    };
  }
}

export default PlaceService;
