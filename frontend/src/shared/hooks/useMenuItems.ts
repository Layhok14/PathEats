import { useState, useEffect, useCallback } from "react";
import api from "../services/axiosService";
import type { VendorMenuItem as MenuItem, MenuCategory } from "../types";

export type MenuItemFormData = Omit<MenuItem, "id">;

export function useMenuItems(filterCategory?: MenuCategory, options: { disabled?: boolean } = {}) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (options.disabled) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/vendor/items");
      setItems(data.data.map(mapItem));
    } catch {
      setError("Failed to load menu items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [options.disabled]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const refresh = fetchItems;

  const filtered = filterCategory && filterCategory !== "All"
    ? items.filter((i) => i.category === filterCategory)
    : items;

  const allItems = items;

  const createItem = async (input: MenuItemFormData): Promise<MenuItem> => {
    const { data } = await api.post("/vendor/items", input);
    const item = mapItem(data.data);
    setItems((prev) => [...prev, item]);
    return item;
  };

  const forkItem = async (_sourceId: string, changes: Partial<MenuItemFormData>): Promise<MenuItem> => {
    return createItem(changes as MenuItemFormData);
  };

  const updateItem = async (id: string, input: Partial<MenuItemFormData>): Promise<void> => {
    const { data } = await api.put(`/vendor/items/${id}`, input);
    const updated = mapItem(data.data);
    setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const deleteItem = async (id: string): Promise<void> => {
    await api.delete(`/vendor/items/${id}`);
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  return { items: filtered, allItems, loading, error, refresh, createItem, forkItem, updateItem, deleteItem };
}

function mapItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: parseFloat(row.price),
    imageUrl: row.image_url || "",
    storageImage: row.storageImage || (row.image_bucket && row.image_path
      ? {
          bucketName: row.image_bucket,
          objectPath: row.image_path,
          mimeType: row.image_mime_type || null,
          altText: row.image_alt_text || "",
        }
      : null),
    category: mapCategory(row.category),
    isAvailable: row.is_available ?? true,
  };
}

function mapCategory(db: string): MenuCategory {
  const map: Record<string, MenuCategory> = {
    snack: "Snack",
    dessert: "Dessert",
    "main course": "Main Course",
    drink: "Drink",
  };
  return map[db] || "All";
}
