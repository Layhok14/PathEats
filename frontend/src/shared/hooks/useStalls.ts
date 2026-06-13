import { useState, useCallback } from "react";
import type { Stall, StallFormData } from "../types";

const MOCK_STALLS: Stall[] = [
  {
    id: "stall-1",
    name: "Healthy Shop",
    photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    category: "Rice Bowls",
    description: "Fresh and healthy rice bowls made daily with locally sourced ingredients.",
    operatingHours: {
      weekdays: { open: "09:00 AM", close: "09:00 PM" },
      weekends: { open: "10:00 AM", close: "08:00 PM" },
    },
    status: "open",
    location: { landmark: "Near Phnom Penh Central Market", latitude: 11.5564, longitude: 104.9282 },
    rating: 4.8,
    reviewCount: 120,
    menuItemIds: ["mi-1", "mi-4"],
  },
  {
    id: "stall-2",
    name: "Happy Food",
    photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    category: "Noodles & Stir-fry",
    description: "Authentic noodle dishes and stir-fries straight from the wok.",
    operatingHours: {
      weekdays: { open: "08:00 AM", close: "08:00 PM" },
      weekends: { open: "09:00 AM", close: "07:00 PM" },
    },
    status: "open",
    location: { landmark: "Toul Tom Poung Market Area", latitude: 11.5449, longitude: 104.9195 },
    rating: 4.5,
    reviewCount: 87,
    menuItemIds: ["mi-2", "mi-7"],
  },
  {
    id: "stall-3",
    name: "Metro Pizza",
    photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    category: "Snacks",
    description: "Quick bites and snacks near the BRT metro stops for commuters on the go.",
    operatingHours: {
      weekdays: { open: "10:00 AM", close: "10:00 PM" },
      weekends: { open: "11:00 AM", close: "09:00 PM" },
    },
    status: "open",
    location: { landmark: "Vattanac BRT Station", latitude: 11.5625, longitude: 104.9312 },
    rating: 4.2,
    reviewCount: 64,
    menuItemIds: ["mi-5"],
  },
  {
    id: "stall-4",
    name: "Zipo Pizza",
    photoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    category: "Snacks",
    description: "Budget-friendly snack stall with daily specials and cold drinks.",
    operatingHours: {
      weekdays: { open: "11:00 AM", close: "07:00 PM" },
      weekends: { open: "12:00 PM", close: "06:00 PM" },
    },
    status: "closed",
    location: { landmark: "Sihanoukville Bus Terminal", latitude: 11.5398, longitude: 104.9151 },
    rating: 4.2,
    reviewCount: 42,
    menuItemIds: ["mi-5", "mi-8"],
  },
];

let stallsDb = [...MOCK_STALLS];

export function useStalls() {
  const [stalls, setStalls] = useState<Stall[]>(stallsDb);
  const [loading, setLoading] = useState(false);

  const getStall = useCallback(
    (id: string) => stalls.find((s) => s.id === id) ?? null,
    [stalls]
  );

  const createStall = useCallback(async (data: StallFormData): Promise<Stall> => {
    setLoading(true);
    // Simulates network latency — replace with axiosInstance.post('/stalls', data)
    await new Promise((r) => setTimeout(r, 600));
    const newStall: Stall = {
      ...data,
      id: `stall-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
    };
    stallsDb = [...stallsDb, newStall];
    setStalls(stallsDb);
    setLoading(false);
    return newStall;
  }, []);

  const updateStall = useCallback(async (id: string, data: Partial<StallFormData>): Promise<void> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    stallsDb = stallsDb.map((s) => (s.id === id ? { ...s, ...data } : s));
    setStalls(stallsDb);
    setLoading(false);
  }, []);

  const deleteStall = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    stallsDb = stallsDb.filter((s) => s.id !== id);
    setStalls(stallsDb);
    setLoading(false);
  }, []);

  return { stalls, loading, getStall, createStall, updateStall, deleteStall };
}
