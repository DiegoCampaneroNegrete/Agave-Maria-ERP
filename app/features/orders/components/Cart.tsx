'use client';

import { CartItem } from './CartItem';
import { CartItem as Item } from '../hooks/useCart';

interface Props {
  items: Item[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export const Cart = ({ items, onIncrease, onDecrease }: Props) => {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />
      ))}
    </div>
  );
};