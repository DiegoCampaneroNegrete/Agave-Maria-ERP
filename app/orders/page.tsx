"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useCart } from "@/features/orders/hooks/useCart";
import { ProductGrid } from "@/features/orders/components/ProductGrid";
import { Cart } from "@/features/orders/components/Cart";
import { CheckoutBar } from "@/features/orders/components/CheckoutBar";
import { PaymentModal, usePaymentCheckout } from "@/features/payments";
import { getDB } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { useState } from "react";

export default function POSPage() {
  const { products } = useProducts();
  const cart = useCart();
  const { processPayment, cancelPayment } = usePaymentCheckout();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const startCheckout = async () => {
    if (cart.cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const db = await getDB();
    const orderId = uuid();
    const now = new Date().toISOString();

    // Create order (without payment_method - will be replaced with payments table)
    await db.run(
      `INSERT INTO orders 
      (id, total, status, payment_status, created_at, updated_at, synced)
      VALUES (?, ?, 'OPEN', 'PENDING', ?, ?, 0)`,
      [orderId, cart.total, now, now]
    );

    // Add order items
    for (const item of cart.cart) {
      await db.run(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [uuid(), orderId, item.id, item.qty, item.price]
      );
    }

    setCurrentOrderId(orderId);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    if (!currentOrderId) {
      alert("Error: no hay orden");
      return;
    }

    const success = await processPayment(currentOrderId);
    
    if (success) {
      cart.clear();
      setShowPaymentModal(false);
      setCurrentOrderId(null);
      alert("✅ Orden completada");
    }
  };

  const handlePaymentCancel = () => {
    cancelPayment();
    setShowPaymentModal(false);
    
    // Delete the order if payment was cancelled
    if (currentOrderId) {
      // Optional: implement soft delete or cleanup logic
    }
    
    setCurrentOrderId(null);
  };

  return (
    <div className="grid md:grid-cols-[2fr_1fr] gap-4">
      {/* Productos */}
      <ProductGrid products={products} onAdd={cart.add} />

      {/* Carrito */}
      <div>
        <Cart
          items={cart.cart}
          onIncrease={cart.increase}
          onDecrease={cart.decrease}
        />

        <CheckoutBar total={cart.total} onCheckout={startCheckout} />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        orderTotal={cart.total}
        onPaymentComplete={handlePaymentComplete}
        onClose={handlePaymentCancel}
      />
    </div>
  );
}
