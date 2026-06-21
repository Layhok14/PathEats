import api from "../../shared/services/axiosService";

let cachedVendors = null;
let fetchPromise = null;

async function ensureVendors() {
  if (cachedVendors) return cachedVendors;
  if (!fetchPromise) {
    fetchPromise = api.get("/places").then(({ data }) => {
      cachedVendors = data.data;
      return cachedVendors;
    });
  }
  return fetchPromise;
}

export async function getVendorById(id) {
  const vendors = await ensureVendors();
  return vendors.find((v) => v.id === id) ?? null;
}
