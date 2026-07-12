import api from "../../shared/services/axiosService";

/** Fetch a single vendor's full details from the backend. */
export async function getVendorById(id) {
  try {
    const { data } = await api.get(`/places/${id}`);
    return data?.data ?? null;
  } catch {
    return null;
  }
}
