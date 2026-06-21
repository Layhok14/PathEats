import VendorRepository from "../repositories/VendorRepository.js";
import VendorModel from "../models/VendorModel.js";
import AppError from "../utils/AppError.js";

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
    const { valid, errors } = VendorModel.validateCreate(data);
    if (!valid) throw new AppError(errors.join("; "), 400);

    let categoryId = data.category_id;
    if (categoryId && !categoryId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
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
    const updated = await this.vendorRepo.update(stallId, data);
    return VendorModel.toResponse(updated);
  }

  async getReviews(ownerId) {
    return this.vendorRepo.getReviews(ownerId);
  }

  async getAllMenuItems(ownerId) {
    return this.vendorRepo.getAllMenuItems(ownerId);
  }

  async createMenuItemGlobal(ownerId, data) {
    if (!data.name || data.price === undefined) {
      throw new AppError("Name and price are required", 400);
    }
    const stalls = await this.vendorRepo.findByOwner(ownerId);
    const placeId = data.place_id || (stalls.length > 0 ? stalls[0].id : null);
    if (!placeId) {
      throw new AppError("No stall found to add item to. Create a stall first.", 400);
    }
    const item = await this.vendorRepo.createMenuItem(placeId, ownerId, data);
    if (!item) throw new AppError("Stall not found", 404);
    return item;
  }

  async updateMenuItemGlobal(ownerId, itemId, data) {
    const item = await this.vendorRepo.updateMenuItemGlobal(ownerId, itemId, data);
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
    if (!data.name || !data.price) {
      throw new AppError("Name and price are required", 400);
    }
    const item = await this.vendorRepo.createMenuItem(placeId, ownerId, data);
    if (!item) throw new AppError("Stall not found", 404);
    return item;
  }

  async updateMenuItem(ownerId, placeId, itemId, data) {
    const item = await this.vendorRepo.updateMenuItem(placeId, itemId, ownerId, data);
    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  async deleteMenuItem(ownerId, placeId, itemId) {
    const deleted = await this.vendorRepo.deleteMenuItem(placeId, itemId, ownerId);
    if (!deleted) throw new AppError("Menu item not found", 404);
  }
}

export default VendorService;
