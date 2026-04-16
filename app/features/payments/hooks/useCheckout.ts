import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  checkoutOrderAtom,
  paymentMethodAtom,
  cashReceivedAtom,
  cardAmountAtom,
  changeAtom,
  checkoutStageAtom,
  checkoutErrorAtom,
} from '../atoms';

export const useCheckoutCalculations = () => {
  const order = useAtomValue(checkoutOrderAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);
  const [cashReceived, setCashReceived] = useAtom(cashReceivedAtom);
  const [cardAmount, setCardAmount] = useAtom(cardAmountAtom);
  const [change, setChange] = useAtom(changeAtom);
  const [error, setError] = useAtom(checkoutErrorAtom);

  const validate = () => {
    if (!paymentMethod) {
      setError('Select payment method');
      return false;
    }

    if (paymentMethod === 'cash') {
      if (cashReceived < order.total) {
        setError(`Insufficient. Need $${(order.total - cashReceived).toFixed(2)}`);
        return false;
      }
      setChange(cashReceived - order.total);
    }

    if (paymentMethod === 'mixed') {
      if (cashReceived < 0 || cashReceived > order.total) {
        setError('Cash amount invalid');
        return false;
      }
      const card = order.total - cashReceived;
      setCardAmount(card);
      setChange(0);
    }

    if (paymentMethod === 'card') {
      setCardAmount(order.total);
      setChange(0);
    }

    setError(null);
    return true;
  };

  return {
    total: order.total,
    subtotal: order.subtotal,
    tax: order.tax,
    cashReceived,
    cardAmount,
    change,
    error,
    validate,
    setCashReceived,
    setCardAmount,
  };
};

export const useCheckoutFlow = () => {
  const [stage, setStage] = useAtom(checkoutStageAtom);
  const setPaymentMethod = useSetAtom(paymentMethodAtom);
  const setCashReceived = useSetAtom(cashReceivedAtom);
  const setCardAmount = useSetAtom(cardAmountAtom);
  const setChange = useSetAtom(changeAtom);
  const setError = useSetAtom(checkoutErrorAtom);

  const reset = () => {
    setStage('summary');
    setPaymentMethod(null);
    setCashReceived(0);
    setCardAmount(0);
    setChange(0);
    setError(null);
  };

  const goNext = () => {
    const sequence: typeof stage[] = [
      'summary',
      'method',
      'input',
      'confirm',
      'receipt',
    ];
    const currentIdx = sequence.indexOf(stage);
    if (currentIdx < sequence.length - 1) {
      setStage(sequence[currentIdx + 1]);
    }
  };

  const goPrev = () => {
    const sequence: typeof stage[] = [
      'summary',
      'method',
      'input',
      'confirm',
      'receipt',
    ];
    const currentIdx = sequence.indexOf(stage);
    if (currentIdx > 0) {
      setStage(sequence[currentIdx - 1]);
    }
  };

  const goToMethod = () => setStage('method');
  const goToInput = () => setStage('input');
  const goToConfirm = () => setStage('confirm');
  const goToReceipt = () => setStage('receipt');

  return {
    stage,
    goNext,
    goPrev,
    reset,
    goToMethod,
    goToInput,
    goToConfirm,
    goToReceipt,
  };
};

export const usePaymentProcessing = () => {
  const [loading, setLoading] = useAtom(atom(false));
  const [error, setError] = useAtom(checkoutErrorAtom);

  const processPayment = async (method: 'cash' | 'card' | 'mixed') => {
    setLoading(true);
    setError(null);
    try {
      // API call here
      // POST /api/payments with { method, amounts, orderId }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
      return false;
    }
  };

  return { processPayment, loading, error };
};

// Import atom at top if needed
import { atom } from 'jotai';
