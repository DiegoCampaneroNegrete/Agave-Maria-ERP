import { useInventory } from "./useInventory"

export function useLowStock() {
  const { inventory } = useInventory()

  const lowStockItems = inventory.filter(
    item => item.currentStock <= item.minimumStock
  )

  return {
    lowStockItems
  }
}