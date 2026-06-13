// Mock service — replace function bodies with axiosInstance calls when backend is ready
import type { Stall, StallFormData } from "../../shared/types";

let db: Stall[] = [];

export const stallService = {
  async getAll(): Promise<Stall[]> {
    return [...db];
  },

  async getById(id: string): Promise<Stall | null> {
    return db.find((s) => s.id === id) ?? null;
  },

  async create(data: StallFormData): Promise<Stall> {
    const stall: Stall = { ...data, id: `stall-${Date.now()}`, rating: 0, reviewCount: 0 };
    db = [...db, stall];
    return stall;
  },

  async update(id: string, data: Partial<StallFormData>): Promise<Stall> {
    db = db.map((s) => (s.id === id ? { ...s, ...data } : s));
    const updated = db.find((s) => s.id === id);
    if (!updated) throw new Error(`Stall ${id} not found`);
    return updated;
  },

  async delete(id: string): Promise<void> {
    db = db.filter((s) => s.id !== id);
  },
};
