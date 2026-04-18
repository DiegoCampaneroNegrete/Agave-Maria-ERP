import type { InventoryItem } from "../types"

export function getInventoryValue(items: InventoryItem[]) {
  return items.reduce(
    (sum, item) => sum + item.currentStock * item.costPerUnit,
    0
  )
}