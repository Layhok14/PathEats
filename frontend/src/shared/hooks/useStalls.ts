import { useState, useEffect } from "react";
import api from "../services/axiosService";
import type { Stall, StallFormData } from "../types";

export function useStalls() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(false);
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

  const getStall = (id: string) => stalls.find((s) => s.id === id) ?? null;

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
        status: formData.status,
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
      const { data } = await api.put(`/vendor/stalls/${id}`, formData);
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
