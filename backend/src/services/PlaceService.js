import PlaceRepository from "../repositories/PlaceRepository.js";
import AppError from "../utils/AppError.js";

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
    altText: row.image_alt_text || "",
  };
};

class PlaceService {
  constructor() {
    this.placeRepo = new PlaceRepository();
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

  toVendor(row, menu) {
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
      photo_url: row.photo_url || "",
      storage_image: toStorageImage(row),
      description: row.description || "",
      open_now: row.open_now,
      hours: "",
      address: row.address || "",
      menu: menu.map((m) => ({
        name: m.name,
        price: parseFloat(m.price),
        desc: m.description || undefined,
        category: m.category || undefined,
        image_url: m.image_url || undefined,
        storage_image: toStorageImage(m),
      })),
    };
  }
}

export default PlaceService;
