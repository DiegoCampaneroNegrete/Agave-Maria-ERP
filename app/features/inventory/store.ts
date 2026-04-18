import { atom } from "jotai"
import type { InventoryItem, StockMovement } from "./types"

export const inventoryAtom = atom<InventoryItem[]>([])
export const stockMovementsAtom = atom<StockMovement[]>([])