import AppError from "./AppError.js";

export function validatePrice(price) {
  if (price === undefined || price === null || price === "") return;
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0 || n > 99999.99 || !String(price).match(/^\d+(\.\d{1,2})?$/)) {
    throw new AppError("Invalid price. Must be a number between 0 and 99,999.99 with at most 2 decimal places.", 400);
  }
}

const MENU_CATEGORY_MAP = {
  snack: "snack", snacks: "snack",
  "main course": "main course", main: "main course",
  drink: "drink", drinks: "drink",
  dessert: "dessert", desserts: "dessert",
};

export function normalizeMenuItemCategory(cat) {
  return MENU_CATEGORY_MAP[(cat ?? "").toLowerCase().trim()] || "snack";
}

const LAT_RANGE = { min: -90, max: 90 };
const LNG_RANGE = { min: -180, max: 180 };

export function validateCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new AppError("Coordinates must be valid numbers", 400);
  }
  if (lat < LAT_RANGE.min || lat > LAT_RANGE.max || lng < LNG_RANGE.min || lng > LNG_RANGE.max) {
    throw new AppError("Coordinates out of valid range", 400);
  }
  return { lat, lng };
}
