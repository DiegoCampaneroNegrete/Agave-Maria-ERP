'use client';

import { Button } from '@/components/ui/Button';

interface Props {
  total: number;
  onCheckout: () => void;
}

export const CheckoutBar = ({ total, onCheckout }: Props) => {
  return (
    <div className="mt-4 bg-app-card p-4 rounded-xl">
      <div className="text-xl font-bold mb-2">
        Total: ${total}
      </div>

      <Button className="w-full " size="lg" onClick={onCheckout}>
        Cobrar
      </Button>
    </div>
  );
};