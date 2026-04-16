'use client';

import { CartItem } from '../types';
import { CartItem as Item } from './CartItem';

interface Props {
  items: CartItem [];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export const Cart = ({ items, onIncrease, onDecrease }: Props) => {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <Item
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />
      ))}
    </div>
  );
};