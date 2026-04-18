import { useAtom } from "jotai"
import { inventoryAtom } from "../store"
import { inventoryStorage } from "../storage"
import { inventoryService } from "../service"

export function useInventory() {
  const [inventory, setInventory] = useAtom(inventoryAtom)

  const decreaseStock = (productId: string, quantity: number) => {
    const updated = inventoryService.decreaseStock(
      inventory,
      productId,
      quantity
    )

    setInventory(updated)
    inventoryStorage.save(updated)
  }

  return {
    inventory,
    decreaseStock
  }
}