import { useState, useEffect, useCallback } from "react";
import api from "../services/axiosService";
import type { Stall, StallFormData } from "../types";

export function useStalls() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stalls from backend on mount
  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/vendor/stalls");
      setStalls(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load stalls");
    } finally {
      setLoading(false);
    }
  };

  const getStall = useCallback((id: string) => stalls.find((s) => s.id === id) ?? null, [stalls]);

  const createStall = async (formData: StallFormData): Promise<Stall> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/vendor/stalls", {
        name: formData.name,
        category_id: formData.category,
        description: formData.description,
        address: formData.location.landmark,
        photo_url: formData.photoUrl,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        status: formData.status === "open" ? "open" : "closed",
        is_open: formData.status === "open",
      });
      const newStall = data.data;
      setStalls((prev) => [...prev, newStall]);
      setLoading(false);
      return newStall;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create stall");
      setLoading(false);
      throw err;
    }
  }

  const updateStall = async (id: string, formData: Partial<StallFormData>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        name: formData.name,
        description: formData.description,
        address: (formData.location as StallFormData["location"])?.landmark,
        photo_url: (formData as any).photoUrl || formData.photo_url,
        latitude: formData.location?.latitude,
        longitude: formData.location?.longitude,
        status: formData.status,
        is_open: formData.status === "open",
        price_range: (formData as any).price_range,
      };
      Object.keys(body).forEach((k) => (body as any)[k] === undefined && delete (body as any)[k]);
      const { data } = await api.put(`/vendor/stalls/${id}`, body);
      const updated = data.data;
      setStalls((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update stall");
      setLoading(false);
      throw err;
    }
  }

  const deleteStall = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/vendor/stalls/${id}`);
      setStalls((prev) => prev.filter((s) => s.id !== id));
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete stall");
      setLoading(false);
      throw err;
    }
  }

  return { stalls, loading, error, getStall, createStall, updateStall, deleteStall, refetch: fetchStalls };
}
