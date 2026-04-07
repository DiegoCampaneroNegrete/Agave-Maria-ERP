// /features/orders/store.ts

import { atom } from 'jotai';
import { OrderItem } from './types';

export const cartAtom = atom<OrderItem[]>([]);

export const totalAtom = atom((get) =>
  get(cartAtom).reduce((sum, item) => sum + item.price * item.quantity, 0)
);