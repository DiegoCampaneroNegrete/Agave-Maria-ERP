/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InventoryItem, StockMovement } from "./types"
import { getDB } from '@/lib/db';

export const decreaseStock = async (
  productId: string,
  quantity: number
) => {
  const db = await getDB();

  const item = await db.query(
    `
    SELECT current_stock
    FROM inventory
    WHERE product_id = ?
    `,
    [productId]
  );

  if (!item) {
    throw new Error('Inventory item not found');
  }

  if (item[0].current_stock < quantity) {
    throw new Error('Insufficient stock');
  }

  await db.run(
    `
    UPDATE inventory
    SET current_stock = current_stock - ?
    WHERE product_id = ?
    `,
    [quantity, productId]
  );
};

export const inventoryService = {
  decreaseStock(
    items: InventoryItem[],
    productId: string,
    quantity: number
  ) {
    return items.map(item =>
      item.productId === productId
        ? {
            ...item,
            currentStock: item.currentStock - quantity,
            updatedAt: new Date().toISOString()
          }
        : item
    )
  },

  increaseStock(
    items: InventoryItem[],
    productId: string,
    quantity: number
  ) {
    return items.map(item =>
      item.productId === productId
        ? {
            ...item,
            currentStock: item.currentStock + quantity,
            updatedAt: new Date().toISOString()
          }
        : item
    )
  }
}

export const applyInventoryForOrder = async (items: any[]) => {
  for (const item of items) {
    await decreaseStock(item.product_id, item.quantity);
  }
};