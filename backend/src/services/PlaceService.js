import PlaceRepository from "../repositories/PlaceRepository.js";
import AppError from "../utils/AppError.js";
import db from "../config/db.js";
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
    await db.query("SELECT refresh_place_rating($1)", [review.vendor_id]);
    return review;
  }

  async deleteReview(reviewId, userId) {
    const review = await this.placeRepo.deleteReview(reviewId, userId);
    if (!review) throw new AppError("Review not found or you do not have permission to delete it", 404);
    await db.query("SELECT refresh_place_rating($1)", [review.place_id]);
    return review;
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
