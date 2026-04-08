'use client';

import { useProducts } from '@/features/products/hooks/useProducts';
import { useCart } from '@/features/orders/hooks/useCart';
import { ProductGrid } from '@/features/orders/components/ProductGrid';
import { Cart } from '@/features/orders/components/Cart';
import { CheckoutBar } from '@/features/orders/components/CheckoutBar';
import { getDB } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export default function POSPage() {
  const { products } = useProducts();
  const cart = useCart();

  const checkout = async () => {
    const db = await getDB();
    const orderId = uuid();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO orders (id, total, status, created_at, updated_at, synced)
       VALUES (?, ?, 'PAID', ?, ?, 0)`,
      [orderId, cart.total, now, now]
    );

    for (const item of cart.cart) {
      await db.run(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [uuid(), orderId, item.id, item.qty, item.price]
      );
    }

    cart.clear();
    alert('✅ Orden completada');
  };

  return (
    <div className="grid md:grid-cols-[2fr_1fr] gap-4">
      
      {/* Productos */}
      <ProductGrid
        products={products}
        onAdd={cart.add}
      />

      {/* Carrito */}
      <div>
        <Cart
          items={cart.cart}
          onIncrease={cart.increase}
          onDecrease={cart.decrease}
        />

        <CheckoutBar
          total={cart.total}
          onCheckout={checkout}
        />
      </div>
    </div>
  );
}