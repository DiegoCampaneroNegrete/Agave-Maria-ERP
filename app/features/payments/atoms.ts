import { atom } from 'jotai';

// Order data
export const checkoutOrderAtom = atom({
  items: [] as any[],
  subtotal: 0,
  tax: 0,
  total: 0,
});

// Payment method selection
export const paymentMethodAtom = atom<'cash' | 'card' | 'mixed' | null>(null);

// Payment amounts
export const cashReceivedAtom = atom(0);
export const cardAmountAtom = atom(0);
export const changeAtom = atom(0);

// UI stage
export const checkoutStageAtom = atom<
  'summary' | 'method' | 'input' | 'confirm' | 'receipt'
>('summary');

// Errors and loading
export const checkoutErrorAtom = atom<string | null>(null);
export const checkoutLoadingAtom = atom(false);

