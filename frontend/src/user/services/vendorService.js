import api from "../../shared/services/axiosService";

let cachedVendors = null;
let fetchPromise = null;

async function ensureVendors() {
  if (cachedVendors) return cachedVendors;
  if (!fetchPromise) {
    fetchPromise = api.get("/places").then(({ data }) => {
      cachedVendors = Array.isArray(data.data) ? data.data : [];
      return cachedVendors;
    }).catch((error) => {
      fetchPromise = null;
      throw error;
    });
  }
  return fetchPromise;
}

export async function getVendorById(id) {
  const vendors = await ensureVendors();
  return vendors.find((v) => String(v.id) === String(id)) ?? null;
}
