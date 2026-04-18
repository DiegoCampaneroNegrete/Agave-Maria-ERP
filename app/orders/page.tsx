"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import { useCart } from "@/features/orders/hooks/useCart";
import { useOrderPayment, useCustomerBalance } from "@/features/orders/hooks";
import { ProductGrid } from "@/features/orders/components/ProductGrid";
import { Cart } from "@/features/orders/components/Cart";
import { CheckoutBar } from "@/features/orders/components/CheckoutBar";
import { CustomerSelector } from "@/features/orders/components/CustomerSelector";
import { PaymentModal, usePaymentCheckout } from "@/features/payments";
import { Customer } from "@/features/payments/types";
import { recordBalancePayment, createCustomerBalance } from "@/features/payments/service";
import { getDB } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { useState } from "react";

export default function POSPage() {
  const { products } = useProducts();
  const cart = useCart();
  const { processPayment, cancelPayment } = usePaymentCheckout();

  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Order payment state
  const orderPayment = useOrderPayment("", cart.total);
  const customerBalance = useCustomerBalance(selectedCustomer?.id);

  // Modal state
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

    // Create order with optional customer_id
    await db.run(
      `INSERT INTO orders 
      (id, total, status, payment_status, customer_id, created_at, updated_at, synced)
      VALUES (?, ?, 'OPEN', 'PENDING', ?, ?, ?, 0)`,
      [orderId, cart.total, selectedCustomer?.id || null, now, now]
    );

    // Add order items
    for (const item of cart.cart) {
      await db.run(
        `INSERT INTO order_items (id, order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [uuid(), orderId, item.id, item.qty, item.price]
      );
    }

    // Initialize order payment state
    orderPayment.state && (
      await new Promise(resolve => {
        setTimeout(() => {
          // State update happens through Jotai
          resolve(null);
        }, 0);
      })
    );

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
      // If customer and partial payment, create/update balance
      if (selectedCustomer && orderPayment.isPartialPayment()) {
        try {
          await createCustomerBalance(
            selectedCustomer.id,
            currentOrderId,
            orderPayment.getBreakdown().outstanding
          );
        } catch (err) {
          console.error("Failed to create balance:", err);
        }
      }

      cart.clear();
      setShowPaymentModal(false);
      setCurrentOrderId(null);
      setSelectedCustomer(null);
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

      {/* Carrito y Cliente */}
      <div className="space-y-4">
        {/* Customer Selector */}
        <CustomerSelector
          onCustomerSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />

        {/* Carrito */}
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
        orderId={currentOrderId || undefined}
        customerId={selectedCustomer?.id}
        selectedCustomer={selectedCustomer}
        onPaymentComplete={handlePaymentComplete}
        onClose={handlePaymentCancel}
      />
    </div>
  );
}
