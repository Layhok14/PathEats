export const PLACE_STATUS = Object.freeze({
  ACTIVE: "active",
  CLOSED: "closed",
});

const ACTIVE_INPUTS = new Set(["active", "approved", "open"]);
const CLOSED_INPUTS = new Set(["closed", "rejected", "suspended", "pending", "inactive"]);

export function normalizePlaceStatus(value, fallback = PLACE_STATUS.ACTIVE) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (ACTIVE_INPUTS.has(normalized)) return PLACE_STATUS.ACTIVE;
  if (CLOSED_INPUTS.has(normalized)) return PLACE_STATUS.CLOSED;
  return fallback;
}

export function statusFromOpenFlag(isOpen) {
  return isOpen ? PLACE_STATUS.ACTIVE : PLACE_STATUS.CLOSED;
}

export function isPlaceActive(row) {
  return normalizePlaceStatus(row?.status) === PLACE_STATUS.ACTIVE && row?.is_open !== false;
}
