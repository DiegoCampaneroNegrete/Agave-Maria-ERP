'use client';

import { useAtomValue } from 'jotai';
import { checkoutStageAtom, paymentMethodAtom } from '../../atoms';
import { useCheckoutFlow } from '../../hooks/useCheckout';
import { CheckoutSummary } from './CheckoutSummary';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CashPaymentInput } from './CashPaymentInput';
import { CardPaymentInput } from './CardPaymentInput';
import { MixedPaymentInput } from './MixedPaymentInput';
import { CheckoutConfirmation } from './CheckoutConfirmation';
import { CheckoutReceipt } from './CheckoutReceipt';

export const CheckoutFlow = () => {
  const stage = useAtomValue(checkoutStageAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);
  const { goToMethod, goToInput, goToConfirm, goPrev, reset } = useCheckoutFlow();

  const handleCloseCheckout = () => {
    reset();
    // Navigate back to orders or dashboard
    window.location.href = '/orders';
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow">
      {stage === 'summary' && (
        <CheckoutSummary onCheckout={goToMethod} />
      )}

      {stage === 'method' && (
        <PaymentMethodSelector onMethodSelected={goToInput} />
      )}

      {stage === 'input' && paymentMethod === 'cash' && (
        <CashPaymentInput onConfirm={goToConfirm} />
      )}

      {stage === 'input' && paymentMethod === 'card' && (
        <CardPaymentInput onConfirm={goToConfirm} onCancel={goPrev} />
      )}

      {stage === 'input' && paymentMethod === 'mixed' && (
        <MixedPaymentInput onConfirm={goToConfirm} />
      )}

      {stage === 'confirm' && (
        <CheckoutConfirmation
          onConfirm={goToConfirm}
          onEdit={goPrev}
        />
      )}

      {stage === 'receipt' && (
        <CheckoutReceipt
          onClose={handleCloseCheckout}
          onPrint={() => window.print()}
        />
      )}

      {/* Back button for non-final stages */}
      {stage !== 'summary' && stage !== 'receipt' && (
        <div className="px-4 pb-4">
          <button
            onClick={goPrev}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};
