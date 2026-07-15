import UserRepository from "../repositories/UserRepository.js";
import db from "../config/db.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  attachProfileImageUrl,
  saveProfileImage,
} from "../services/profileImageService.js";

const userRepo = new UserRepository();

export const getProfile = catchAsync(async (req, res) => {
  const user = await userRepo.findById(req.user.sub);
  if (!user) throw new AppError("User profile row was not found", 404, {
    code: "USER_PROFILE_NOT_FOUND",
    safeMessage: "We could not find your profile.",
  });
  res.json({ success: true, data: attachProfileImageUrl(user) });
});

export const updateProfile = catchAsync(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const data = {};
  if (firstName !== undefined) data.first_name = firstName;
  if (lastName !== undefined) data.last_name = lastName;
  if (phone !== undefined) data.phone_number = phone;
  const user = await userRepo.updateProfile(req.user.sub, data);
  if (!user) throw new AppError("Profile update did not include editable fields", 400, {
    code: "NO_PROFILE_FIELDS",
    safeMessage: "Choose at least one profile field to update.",
  });
  res.json({ success: true, data: user });
});

export const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Profile image file is required", 400);

  const profileImage = await saveProfileImage({
    userId: req.user.sub,
    file: req.file,
    altText: req.body.altText,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });

  res.status(201).json({ success: true, data: profileImage });
});

export const getPreferences = catchAsync(async (req, res) => {
  const preferences = await userRepo.findPreferences(req.user.sub);
  res.json({
    success: true,
    data: preferences ?? {
      user_id: req.user.sub,
      search_radius: 100,
      theme: "light",
      is_active: true,
    },
  });
});

export const updatePreferences = catchAsync(async (req, res) => {
  const { searchRadius, theme, isActive } = req.body;
  const includesSupportedField =
    searchRadius !== undefined || theme !== undefined || isActive !== undefined;

  if (!includesSupportedField) {
    throw new AppError("Choose at least one preference to update", 400);
  }

  if (searchRadius !== undefined) {
    const parsedSearchRadius = Number(searchRadius);
    const isValidSearchRadius =
      Number.isInteger(parsedSearchRadius) && parsedSearchRadius > 0 && parsedSearchRadius <= 100000;
    if (!isValidSearchRadius) {
      throw new AppError("Search radius must be a whole number between 1 and 100000", 400);
    }
  }

  if (theme !== undefined && !["light", "dark"].includes(theme)) {
    throw new AppError("Theme must be light or dark", 400);
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new AppError("isActive must be a boolean", 400);
  }

  const preferences = await userRepo.upsertPreferences(req.user.sub, {
    search_radius: searchRadius === undefined ? undefined : Number(searchRadius),
    theme,
    is_active: isActive,
  });
  res.json({ success: true, data: preferences });
});

// ── Bookmarks ──

export const getBookmarks = catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT b.id, b.place_id, b.notes, b.created_at,
            p.name AS place_name, p.photo_url, p.price_range, p.rating_avg, p.address
     FROM bookmarks b
     JOIN places p ON p.id = b.place_id
     JOIN users owner_user
       ON owner_user.id = p.owner_id
      AND owner_user.role_scope = 'VENDOR'
      AND owner_user.is_banned = FALSE
     WHERE b.user_id = $1
       AND p.status = 'active'
       AND p.is_open = TRUE
     ORDER BY b.created_at DESC`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
});

export const addBookmark = catchAsync(async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) throw new AppError("placeId is required", 400);

  const place = await db.query(
    `SELECT p.id
     FROM places p
     JOIN users owner_user
       ON owner_user.id = p.owner_id
      AND owner_user.role_scope = 'VENDOR'
      AND owner_user.is_banned = FALSE
     WHERE p.id = $1
       AND p.status = 'active'
       AND p.is_open = TRUE
     LIMIT 1`,
    [placeId]
  );
  if (place.rowCount === 0) {
    throw new AppError("Place not found", 404, {
      code: "PLACE_NOT_FOUND",
      safeMessage: "We could not find that place.",
    });
  }

  const { rows } = await db.query(
    `INSERT INTO bookmarks (user_id, place_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id, place_id, created_at`,
    [req.user.sub, placeId]
  );
  res.status(201).json({ success: true, data: rows[0] || null });
});

export const removeBookmark = catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM bookmarks WHERE user_id = $1 AND place_id = $2",
    [req.user.sub, req.params.placeId]
  );
  res.json({ success: true, data: { deleted: rowCount > 0 } });
});

// ── Saved Routes ──

export const getRoutes = catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, label, origin, destination, waypoints, saved_at
     FROM routes WHERE user_id = $1
     ORDER BY saved_at DESC`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
});

export const addRoute = catchAsync(async (req, res) => {
  const { label, origin, destination, waypoints } = req.body;
  if (!origin || !destination) throw new AppError("origin and destination are required", 400);
  const { rows } = await db.query(
    `INSERT INTO routes (user_id, label, origin, destination, waypoints)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, label, origin, destination, waypoints, saved_at`,
    [req.user.sub, label || null, JSON.stringify(origin), JSON.stringify(destination), waypoints ? JSON.stringify(waypoints) : null]
  );
  res.status(201).json({ success: true, data: rows[0] });
});

export const deleteAllRoutes = catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM routes WHERE user_id = $1",
    [req.user.sub]
  );
  res.json({ success: true, data: { deleted: rowCount } });
});

export const deleteRoute = catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM routes WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.sub]
  );
  if (!rowCount) throw new AppError("Route not found", 404);
  res.json({ success: true, data: { deleted: true } });
});

export const updateRoute = catchAsync(async (req, res) => {
  const { label } = req.body;
  if (!label || !label.trim()) throw new AppError("Label is required", 400);

  const { rowCount } = await db.query(
    `SELECT id FROM routes WHERE user_id = $1 AND label = $2 AND id != $3 LIMIT 1`,
    [req.user.sub, label.trim(), req.params.id]
  );
  if (rowCount > 0) {
    throw new AppError("You already have a route with that label", 409, {
      code: "DUPLICATE_LABEL",
      safeMessage: "You already have a saved route with that name.",
    });
  }

  const { rows } = await db.query(
    `UPDATE routes SET label = $1 WHERE id = $2 AND user_id = $3 RETURNING id, label, origin, destination, waypoints, saved_at`,
    [label.trim(), req.params.id, req.user.sub]
  );
  if (rows.length === 0) throw new AppError("Route not found", 404);
  res.json({ success: true, data: rows[0] });
});

// ── Search History ──

export const getHistory = catchAsync(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, query, filters, results_count, created_at
     FROM search_history WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 50`,
    [req.user.sub]
  );
  res.json({ success: true, data: rows });
});

export const addHistory = catchAsync(async (req, res) => {
  const { query, filters, resultsCount } = req.body;
  if (!query) throw new AppError("query is required", 400);
  const { rows } = await db.query(
    `INSERT INTO search_history (user_id, query, filters, results_count)
     VALUES ($1, $2, $3, $4)
     RETURNING id, query, filters, results_count, created_at`,
    [req.user.sub, query, filters ? JSON.stringify(filters) : null, resultsCount || 0]
  );
  res.status(201).json({ success: true, data: rows[0] });
});

export const deleteAllHistory = catchAsync(async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM search_history WHERE user_id = $1", [req.user.sub]);
  res.json({ success: true, data: { deleted: rowCount } });
});

export const deleteHistory = catchAsync(async (req, res) => {
  const { rowCount } = await db.query(
    "DELETE FROM search_history WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.sub]
  );
  res.json({ success: true, data: { deleted: rowCount > 0 } });
});
