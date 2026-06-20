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

  static validateUpdate(data) {
    const errors = [];

    if (data.name !== undefined && (!data.name || typeof data.name !== "string")) {
      errors.push("Name must be a non-empty string");
    }

    if (data.price_range !== undefined && data.price_range !== null) {
      if (!Number.isInteger(data.price_range) || data.price_range < 1 || data.price_range > 4) {
        errors.push("Price range must be an integer between 1 and 4");
      }
    }

    return { valid: errors.length === 0, errors };
  }

  static toResponse(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category_id: row.category_id,
      category_slug: row.category_slug,
      category_name: row.category_name,
      address: row.address,
      photo_url: row.photo_url,
      price_range: row.price_range,
      rating_avg: row.rating_avg,
      rating_count: row.rating_count,
      is_open: row.is_open,
      status: row.status,
      location: row.location
        ? { latitude: row.location.y, longitude: row.location.x }
        : null,
      created_at: row.created_at,
    };
  }
}

export default VendorModel;
