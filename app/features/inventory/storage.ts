import type { InventoryItem } from "./types"

const KEY = "inventory"

export const inventoryStorage = {
  load(): InventoryItem[] {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : []
  },

  save(items: InventoryItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items))
  }
}