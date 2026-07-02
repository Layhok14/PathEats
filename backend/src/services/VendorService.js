import VendorRepository from "../repositories/VendorRepository.js";
import VendorModel from "../models/vendorModel.js";
import AppError from "../utils/AppError.js";
import { sanitizeText } from "../utils/sanitize.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const normalizeMenuItemIds = (data) => {
  const rawIds = data.menu_item_ids ?? data.menuItemIds ?? [];
  if (!Array.isArray(rawIds)) {
    throw new AppError("Menu item IDs must be an array", 400);
  }

  const ids = [...new Set(rawIds.map((id) => String(id).trim()).filter(Boolean))];
  const invalidId = ids.find((id) => !UUID_PATTERN.test(id));
  if (invalidId) {
    throw new AppError("Menu item IDs must be valid UUIDs", 400);
  }

  return ids;
};

class VendorService {
  constructor() {
    this.vendorRepo = new VendorRepository();
  }

  async getDashboard(ownerId) {
    return this.vendorRepo.getDashboardMetrics(ownerId);
  }

  async getStalls(ownerId) {
    const rows = await this.vendorRepo.findByOwner(ownerId);
    return rows.map(VendorModel.toResponse);
  }

  async createStall(ownerId, data) {
    if (!ownerId) throw new AppError("Vendor owner is required", 401);

    const { valid, errors } = VendorModel.validateCreate(data);
    if (!valid) throw new AppError(errors.join("; "), 400);

    let categoryId = data.category_id;
    if (categoryId && !UUID_PATTERN.test(categoryId)) {
      const cat = await this.vendorRepo.findCategory(categoryId);
      if (cat) {
        categoryId = cat.id;
      } else {
        throw new AppError(`Category "${categoryId}" not found`, 400);
      }
    }

    const stall = await this.vendorRepo.create({
      owner_id: ownerId,
      ...data,
      category_id: categoryId,
      menu_item_ids: normalizeMenuItemIds(data),
      name: sanitizeText(data.name),
      description: data.description ? sanitizeText(data.description) : data.description,
    });

    return VendorModel.toResponse(stall);
  }

  async getStallById(ownerId, stallId) {
    const stall = await this.vendorRepo.findOwnedById(stallId, ownerId);
    if (!stall) throw new AppError("Stall not found", 404);
    return VendorModel.toResponse(stall);
  }

  async updateStall(ownerId, stallId, data) {
    const stall = await this.vendorRepo.findOwnedById(stallId, ownerId);
    if (!stall) throw new AppError("Stall not found", 404);
    const sanitized = {
      ...data,
      name: data.name ? sanitizeText(data.name) : data.name,
      description: data.description ? sanitizeText(data.description) : data.description,
    };
    const updated = await this.vendorRepo.update(stallId, ownerId, sanitized);
    return VendorModel.toResponse(updated);
  }

  async deleteStall(ownerId, stallId) {
    const stall = await this.vendorRepo.findOwnedById(stallId, ownerId);
    if (!stall) throw new AppError("Stall not found", 404);
    const deleted = await this.vendorRepo.deleteStall(stallId, ownerId);
    if (!deleted) throw new AppError("Stall not found", 404);
  }

  async getReviews(ownerId) {
    return this.vendorRepo.getReviews(ownerId);
  }

  async getAllMenuItems(ownerId) {
    return this.vendorRepo.getAllMenuItems(ownerId);
  }

  async createMenuItemGlobal(ownerId, data) {
    if (!data.name || data.price === undefined || data.price === null || data.price === "") {
      throw new AppError("Name and price are required", 400);
    }
    const stalls = await this.vendorRepo.findByOwner(ownerId);
    const placeId = data.place_id || (stalls.length > 0 ? stalls[0].id : null);
    if (!placeId) {
      throw new AppError("No stall found to add item to. Create a stall first.", 400);
    }
    const sanitized = {
      ...data,
      name: sanitizeText(data.name),
      description: data.description ? sanitizeText(data.description) : data.description,
    };
    const item = await this.vendorRepo.createMenuItem(placeId, ownerId, sanitized);
    if (!item) throw new AppError("Stall not found", 404);
    return item;
  }

  async updateMenuItemGlobal(ownerId, itemId, data) {
    const sanitized = {
      ...data,
      name: data.name ? sanitizeText(data.name) : data.name,
      description: data.description ? sanitizeText(data.description) : data.description,
    };
    const item = await this.vendorRepo.updateMenuItemGlobal(ownerId, itemId, sanitized);
    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  async deleteMenuItemGlobal(ownerId, itemId) {
    const deleted = await this.vendorRepo.deleteMenuItemGlobal(ownerId, itemId);
    if (!deleted) throw new AppError("Menu item not found", 404);
  }

  async getMenuItems(ownerId, placeId) {
    const stall = await this.vendorRepo.findOwnedById(placeId, ownerId);
    if (!stall) throw new AppError("Stall not found", 404);
    return this.vendorRepo.getMenuItems(placeId, ownerId);
  }

  async createMenuItem(ownerId, placeId, data) {
    if (!data.name || data.price === undefined || data.price === null || data.price === "") {
      throw new AppError("Name and price are required", 400);
    }
    const sanitized = {
      ...data,
      name: sanitizeText(data.name),
      description: data.description ? sanitizeText(data.description) : data.description,
    };
    const item = await this.vendorRepo.createMenuItem(placeId, ownerId, sanitized);
    if (!item) throw new AppError("Stall not found", 404);
    return item;
  }

  async updateMenuItem(ownerId, placeId, itemId, data) {
    const sanitized = {
      ...data,
      name: data.name ? sanitizeText(data.name) : data.name,
      description: data.description ? sanitizeText(data.description) : data.description,
    };
    const item = await this.vendorRepo.updateMenuItem(placeId, itemId, ownerId, sanitized);
    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  async deleteMenuItem(ownerId, placeId, itemId) {
    const deleted = await this.vendorRepo.deleteMenuItem(placeId, itemId, ownerId);
    if (!deleted) throw new AppError("Menu item not found", 404);
  }
}

export default VendorService;
