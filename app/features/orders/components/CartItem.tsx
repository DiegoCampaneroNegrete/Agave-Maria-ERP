'use client';

import { CartItem as Item } from '../hooks/useCart';
import { Button } from '@/components/ui/Button';

interface Props {
  item: Item;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const CartItem = ({ item, onIncrease, onDecrease }: Props) => {
  return (
    <div className="flex justify-between items-center bg-app-card p-3 rounded-xl">
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