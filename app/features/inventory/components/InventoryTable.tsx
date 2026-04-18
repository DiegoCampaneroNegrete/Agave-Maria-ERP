import { useInventory } from "../hooks/useInventory"

export function InventoryTable() {
  const { inventory } = useInventory()

  return (
    <div>
      {inventory.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>{item.currentStock}</span>
        </div>
      ))}
    </div>
  )
}