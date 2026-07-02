import { isPlaceActive } from "../utils/placeStatus.js";

const toStorageImage = (row) => {
  if (!row.image_bucket || !row.image_path) return null;

  return {
    bucketName: row.image_bucket,
    objectPath: row.image_path,
    mimeType: row.image_mime_type || null,
    altText: row.image_alt_text || "",
  };
};

class VendorModel {
  static validateCreate(data) {
    const errors = [];

    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("Name is required");
    }

    if (!data.category_id) {
      errors.push("Category is required");
    }

    if (data.description && typeof data.description !== "string") {
      errors.push("Description must be a string");
    }

    if (data.price_range !== undefined && data.price_range !== null) {
      if (!Number.isInteger(data.price_range) || data.price_range < 1 || data.price_range > 4) {
        errors.push("Price range must be an integer between 1 and 4");
      }
    }

    return { valid: errors.length === 0, errors };
  }

  static toResponse(row) {
    const isOpen = isPlaceActive(row);

    return {
      id: row.id,
      name: row.name,
      description: row.description || "",
      photoUrl: row.photo_url || "",
      storageImage: toStorageImage(row),
      category: row.category_name || "Others",
      category_id: row.category_id,
      price_range: row.price_range || 1,
      rating: parseFloat(row.rating_avg) || 0,
      reviewCount: parseInt(row.rating_count) || 0,
      status: isOpen ? "open" : "closed",
      adminManaged: Boolean(row.is_admin_managed),
      location: {
        landmark: row.address || "",
        latitude: parseFloat(row.lat) || 0,
        longitude: parseFloat(row.lng) || 0,
      },
      operatingHours: {
        weekdays: { open: "07:00 AM", close: "09:00 PM" },
        weekends: { open: "08:00 AM", close: "08:00 PM" },
      },
      menuItemIds: [],
      created_at: row.created_at,
    };
  }
}

export default VendorModel;
