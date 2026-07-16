import UserRepository from "../repositories/UserRepository.js";
import AppError from "../utils/AppError.js";

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User profile row was not found", 404, {
      code: "USER_PROFILE_NOT_FOUND",
      safeMessage: "We could not find your profile.",
    });
    return user;
  }

  async updateProfile(userId, { firstName, lastName, phone }) {
    const data = {};
    if (firstName !== undefined) data.first_name = firstName;
    if (lastName !== undefined) data.last_name = lastName;
    if (phone !== undefined) data.phone_number = phone;
    const user = await this.userRepo.updateProfile(userId, data);
    if (!user) throw new AppError("Profile update did not include editable fields", 400, {
      code: "NO_PROFILE_FIELDS",
      safeMessage: "Choose at least one profile field to update.",
    });
    return user;
  }

  async getPreferences(userId) {
    return await this.userRepo.findPreferences(userId) ?? {
      user_id: userId,
      search_radius: 100,
      theme: "light",
      is_active: true,
    };
  }

  async updatePreferences(userId, { searchRadius, theme, isActive }) {
    const includesSupportedField =
      searchRadius !== undefined || theme !== undefined || isActive !== undefined;
    if (!includesSupportedField) throw new AppError("Choose at least one preference to update", 400);
    if (searchRadius !== undefined) {
      const parsed = Number(searchRadius);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100000) {
        throw new AppError("Search radius must be a whole number between 1 and 100000", 400);
      }
    }
    if (theme !== undefined && !["light", "dark"].includes(theme)) throw new AppError("Theme must be light or dark", 400);
    if (isActive !== undefined && typeof isActive !== "boolean") throw new AppError("isActive must be a boolean", 400);
    return this.userRepo.upsertPreferences(userId, {
      search_radius: searchRadius === undefined ? undefined : Number(searchRadius),
      theme,
      is_active: isActive,
    });
  }

  getBookmarks(userId) {
    return this.userRepo.getBookmarks(userId);
  }

  async addBookmark(userId, placeId) {
    if (!placeId) throw new AppError("placeId is required", 400);
    const placeExists = await this.userRepo.isPublicPlace(placeId);
    if (!placeExists) {
      throw new AppError("Place not found", 404, {
        code: "PLACE_NOT_FOUND",
        safeMessage: "We could not find that place.",
      });
    }
    return this.userRepo.addBookmark(userId, placeId);
  }

  removeBookmark(userId, placeId) {
    return this.userRepo.removeBookmark(userId, placeId);
  }

  getRoutes(userId) {
    return this.userRepo.getRoutes(userId);
  }

  async addRoute(userId, payload) {
    if (!payload.origin || !payload.destination) {
      throw new AppError("origin and destination are required", 400);
    }
    return this.userRepo.addRoute(userId, payload);
  }

  async deleteAllRoutes(userId) {
    return this.userRepo.deleteAllRoutes(userId);
  }

  async deleteRoute(userId, routeId) {
    const deleted = await this.userRepo.deleteRoute(userId, routeId);
    if (!deleted) throw new AppError("Route not found", 404);
    return true;
  }

  async updateRoute(userId, routeId, label) {
    const normalizedLabel = String(label ?? "").trim();
    if (!normalizedLabel) throw new AppError("Label is required", 400);
    if (await this.userRepo.routeLabelExists(userId, routeId, normalizedLabel)) {
      throw new AppError("You already have a route with that label", 409, {
        code: "DUPLICATE_LABEL",
        safeMessage: "You already have a saved route with that name.",
      });
    }
    const route = await this.userRepo.updateRouteLabel(userId, routeId, normalizedLabel);
    if (!route) throw new AppError("Route not found", 404);
    return route;
  }

  getHistory(userId) {
    return this.userRepo.getHistory(userId);
  }

  async addHistory(userId, payload) {
    if (!payload.query) throw new AppError("query is required", 400);
    return this.userRepo.addHistory(userId, payload);
  }

  deleteAllHistory(userId) {
    return this.userRepo.deleteAllHistory(userId);
  }

  deleteHistory(userId, historyId) {
    return this.userRepo.deleteHistory(userId, historyId);
  }
}

export default UserService;
