'use client';

import { useOrderStore } from '@/features/orders/hooks';
import { checkoutOrderAtom } from '@/features/payments/atoms';
import { CheckoutFlow } from '@/features/payments/components/checkout';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

/**
 * Example checkout page implementation
 * Shows how to integrate CheckoutFlow with your order data
 */
export default function CheckoutPage() {
  const setCheckoutOrder = useSetAtom(checkoutOrderAtom);
  const currentOrder = useOrderStore(); // Get current order from cart
  
  // Initialize checkout with current order data
  useEffect(() => {
    if (currentOrder) {
      setCheckoutOrder({
        items: currentOrder.items,
        subtotal: currentOrder.subtotal,
        tax: currentOrder.tax,
        total: currentOrder.total,
      });
    }
  }, [currentOrder, setCheckoutOrder]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <CheckoutFlow />
      </div>
    </div>
  );
}

/**
 * INTEGRATION CHECKLIST:
 * 
 * 1. ✓ Create checkout page at app/checkout/page.tsx
 * 2. ✓ Import CheckoutFlow component
 * 3. ✓ Set checkout order data from your order store
 * 4. ✓ Wire payment backend endpoint
 * 5. ✓ Connect to payment processor (Stripe/Square/etc)
 * 
 * NEXT STEPS:
 * 
 * // In app/api/payments/route.ts
 * export async function POST(req: Request) {
 *   const { method, orderId, cashAmount, cardAmount, change } = await req.json();
 *   
 *   if (method === 'cash') {
 *     // Handle cash payment
 *     return recordCashPayment({ orderId, amount: cashAmount, change });
 *   }
 *   
 *   if (method === 'card') {
 *     // Process with payment processor
 *     const stripe = getStripeClient();
 *     const paymentIntent = await stripe.paymentIntents.create({...});
 *     return handleCardPayment({...});
 *   }
 *   
 *   if (method === 'mixed') {
 *     // Handle both
 *     await recordCashPayment({ orderId, amount: cashAmount, change: 0 });
 *     const paymentIntent = await processCard({ orderId, amount: cardAmount });
 *     return { success: true, paymentId };
 *   }
 * }
 */
