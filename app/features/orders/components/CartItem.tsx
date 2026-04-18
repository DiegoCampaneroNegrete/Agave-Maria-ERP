'use client';

import { Button } from '@/components/ui/Button';
import { CartItem as Item } from '../types';

interface Props {
  item: Item;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const CartItem = ({ item, onIncrease, onDecrease }: Props) => {
  return (
    <div key={'cart-item' + item.id + '-' + item.qty} className="flex justify-between items-center bg-app-card p-3 rounded-xl">
      <div>
        <div>{item.name}</div>
        <div className="text-sm text-app-muted">
          ${item.price} x {item.qty}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onDecrease}>-</Button>
        <span>{item.qty}</span>
        <Button size="sm" onClick={onIncrease}>+</Button>
      </div>
    </div>
  );
};