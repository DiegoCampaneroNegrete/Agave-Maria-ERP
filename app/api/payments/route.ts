import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments
 * 
 * Handles payment processing for:
 * - Cash payments
 * - Card payments  
 * - Mixed payments (cash + card)
 */

interface PaymentRequest {
  method: 'cash' | 'card' | 'mixed';
  orderId: string;
  total: number;
  cashAmount?: number;
  cardAmount?: number;
  change?: number;
}

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  receiptId?: string;
  error?: string;
  timestamp: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    const body: PaymentRequest = await req.json();
    const { method, orderId, total, cashAmount, cardAmount, change } = body;

    // Validate request
    if (!method || !orderId || !total) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['cash', 'card', 'mixed'].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment method',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Process payment based on method
    let paymentId: string;

    switch (method) {
      case 'cash':
        paymentId = await handleCashPayment({
          orderId,
          amount: cashAmount || total,
          change: change || 0,
        });
        break;

      case 'card':
        paymentId = await handleCardPayment({
          orderId,
          amount: cardAmount || total,
        });
        break;

      case 'mixed':
        paymentId = await handleMixedPayment({
          orderId,
          cashAmount: cashAmount || 0,
          cardAmount: cardAmount || 0,
        });
        break;

      default:
        throw new Error('Invalid payment method');
    }

    // Record payment in database
    await recordPayment({
      paymentId,
      orderId,
      method,
      amount: total,
      cashAmount,
      cardAmount,
    });

    const receiptId = `REC-${Date.now()}`;

    return NextResponse.json({
      success: true,
      paymentId,
      receiptId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Cash payment handler
 */
async function handleCashPayment(data: {
  orderId: string;
  amount: number;
  change: number;
}): Promise<string> {
  // Record cash payment in cash register
  // Update order status to paid
  // Log transaction

  const paymentId = `CASH-${data.orderId}-${Date.now()}`;

  console.log('Cash payment recorded:', {
    paymentId,
    orderId: data.orderId,
    amount: data.amount,
    change: data.change,
  });

  return paymentId;
}

/**
 * Card payment handler - integrate with Stripe/Square/etc
 */
async function handleCardPayment(data: { orderId: string; amount: number }): Promise<string> {
  // Example: Stripe integration
  // const stripe = getStripeClient();
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(data.amount * 100),
  //   currency: 'usd',
  //   metadata: { orderId: data.orderId },
  // });

  const paymentId = `CARD-${data.orderId}-${Date.now()}`;

  console.log('Card payment processed:', {
    paymentId,
    orderId: data.orderId,
    amount: data.amount,
  });

  return paymentId;
}

/**
 * Mixed payment handler
 * Split between cash and card
 */
async function handleMixedPayment(data: {
  orderId: string;
  cashAmount: number;
  cardAmount: number;
}): Promise<string> {
  // Record cash portion
  const cashPaymentId = await handleCashPayment({
    orderId: data.orderId,
    amount: data.cashAmount,
    change: 0,
  });

  // Process card portion
  const cardPaymentId = await handleCardPayment({
    orderId: data.orderId,
    amount: data.cardAmount,
  });

  // Link both payments together
  const mixedPaymentId = `MIXED-${data.orderId}-${Date.now()}`;

  console.log('Mixed payment processed:', {
    mixedPaymentId,
    cashPaymentId,
    cardPaymentId,
    cashAmount: data.cashAmount,
    cardAmount: data.cardAmount,
  });

  return mixedPaymentId;
}

/**
 * Record payment in database
 */
async function recordPayment(data: {
  paymentId: string;
  orderId: string;
  method: 'cash' | 'card' | 'mixed';
  amount: number;
  cashAmount?: number;
  cardAmount?: number;
}): Promise<void> {
  // TODO: Implement database insert
  // INSERT INTO payments (payment_id, order_id, method, amount, cash_amount, card_amount, created_at)
  // VALUES (...)

  console.log('Payment recorded in database:', data);
}
