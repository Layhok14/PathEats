import { useState } from "react";
import type { VendorMenuItem as MenuItem, MenuCategory } from "../types";

const INITIAL: MenuItem[] = [
  { id: "mi-1", name: "Hainanese Chicken Rice", description: "Tender poached chicken over fragrant rice with ginger sauce", price: 8.5, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80", category: "Rice", isAvailable: true },
  { id: "mi-2", name: "Classic Pad Thai", description: "Stir-fried rice noodles with egg, bean sprouts, and peanuts", price: 7.2, imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c18106?w=400&q=80", category: "Noodles", isAvailable: true },
  { id: "mi-3", name: "Iced Thai Milk Tea", description: "Creamy sweetened milk tea served over ice", price: 3.5, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", category: "Drinks", isAvailable: false },
  { id: "mi-4", name: "Nasi Lemak", description: "Coconut rice with sambal, anchovies, peanuts, and boiled egg", price: 9.0, imageUrl: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=400&q=80", category: "Rice", isAvailable: true },
  { id: "mi-5", name: "Spring Rolls", description: "Crispy fried rolls filled with vegetables and glass noodles", price: 4.5, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", category: "Snacks", isAvailable: true },
  { id: "mi-6", name: "Mango Sticky Rice", description: "Sweet glutinous rice with fresh mango and coconut cream", price: 5.0, imageUrl: "https://images.unsplash.com/photo-1602662659768-a6d615e35acb?w=400&q=80", category: "Desserts", isAvailable: true },
  { id: "mi-7", name: "Beef Pho", description: "Vietnamese noodle soup with slow-cooked beef broth and herbs", price: 8.0, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80", category: "Noodles", isAvailable: true },
  { id: "mi-8", name: "Fresh Coconut Water", description: "Natural coconut water served chilled in the shell", price: 3.0, imageUrl: "https://images.unsplash.com/photo-1565932887479-b18a9a4a0001?w=400&q=80", category: "Drinks", isAvailable: true },
];

// Module-level store so all components share the same data
let menuDb: MenuItem[] = [...INITIAL];

export type MenuItemFormData = Omit<MenuItem, "id">;

export function getAllMenuItems(): MenuItem[] {
  return menuDb;
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuDb.find((m) => m.id === id);
}

export function useMenuItems(filterCategory: MenuCategory = "All") {
  const [items, setItems] = useState<MenuItem[]>(menuDb);

  const refresh = () => setItems([...menuDb]);

  const filtered = (filterCategory === "All" ? items : items.filter((i) => i.category === filterCategory));
  const allItems = items;

  const createItem = async (data: MenuItemFormData): Promise<MenuItem> => {
    await new Promise((r) => setTimeout(r, 300));
    const item: MenuItem = { ...data, id: `mi-${Date.now()}` };
    menuDb = [...menuDb, item];
    setItems([...menuDb]);
    return item;
  }

  // Fork: creates a new item with modified properties (used when editing from stall context)
  const forkItem = async (sourceId: string, changes: Partial<MenuItemFormData>): Promise<MenuItem> => {
    const source = menuDb.find((m) => m.id === sourceId);
    if (!source) throw new Error("Item not found");
    await new Promise((r) => setTimeout(r, 300));
    const forked: MenuItem = { ...source, ...changes, id: `mi-${Date.now()}` };
    menuDb = [...menuDb, forked];
    setItems([...menuDb]);
    return forked;
  }

  const updateItem = async (id: string, data: Partial<MenuItemFormData>): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    menuDb = menuDb.map((m) => m.id === id ? { ...m, ...data } : m);
    setItems([...menuDb]);
  }

  const deleteItem = async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    menuDb = menuDb.filter((m) => m.id !== id);
    setItems([...menuDb]);
  }

  return { items: filtered, allItems, refresh, createItem, forkItem, updateItem, deleteItem };
}
