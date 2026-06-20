import VendorRepository from "../repositories/VendorRepository.js";
import VendorModel from "../models/VendorModel.js";
import AppError from "../utils/AppError.js";

class VendorService {
  constructor() {
    this.vendorRepo = new VendorRepository();
  }

  /**
   * Get dashboard metrics for the logged-in vendor.
   * @param {string} ownerId — the vendor's user ID
   */
  async getDashboard(ownerId) {
    return this.vendorRepo.getDashboardMetrics(ownerId);
  }

  /**
   * Get all stalls owned by this vendor.
   */
  async getStalls(ownerId) {
    const rows = await this.vendorRepo.findByOwner(ownerId);
    return rows.map(VendorModel.toResponse);
  }

  /**
   * Create a new stall.
   */
  async createStall(ownerId, data) {
    const { valid, errors } = VendorModel.validateCreate(data);
    if (!valid) throw new AppError(errors.join("; "), 400);

    const stall = await this.vendorRepo.create({
      owner_id: ownerId,
      ...data,
    });

    return VendorModel.toResponse(stall);
  }

  /**
   * Get a single stall by id (ownership-checked).
   */
  async getStallById(ownerId, stallId) {
    const stall = await this.vendorRepo.findOwnedById(stallId, ownerId);
    if (!stall) throw new AppError("Stall not found", 404);
    return VendorModel.toResponse(stall);
  }
}

export default VendorService;
