export type StockMovementType =
  | "sale"
  | "purchase"
  | "adjustment"
  | "waste"

export interface InventoryItem {
  id: string
  productId: string
  name: string
  sku?: string
  unit: "piece" | "ml" | "g"
  currentStock: number
  minimumStock: number
  costPerUnit: number
  updatedAt: string
}

export interface StockMovement {
  id: string
  inventoryItemId: string
  type: StockMovementType
  quantity: number
  note?: string
  orderId?: string
  createdAt: string
}