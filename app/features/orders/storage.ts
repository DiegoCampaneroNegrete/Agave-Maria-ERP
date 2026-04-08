import { CartItem } from "./types";

const KEY = 'agave_cart';

export const saveCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(KEY, JSON.stringify(cart));
};

export const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
};

export const clearCartStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
};