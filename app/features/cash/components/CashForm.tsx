'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const CashForm = ({
  counted,
  setCounted,
  difference,
  onSubmit,
}: {
  counted: number;
  setCounted: (value: number) => void;
  difference: number;
  onSubmit: () => void;
}) => {
  return (
    <Card>
      <div className="space-y-3">

        <Input
          label="Dinero contado en caja"
          type="number"
          value={counted}
          onChange={(e) => setCounted(Number(e.target.value))}
        />

        <div>
          Diferencia:{' '}
          <span
            className={
              difference === 0
                ? 'text-green-400'
                : difference > 0
                ? 'text-blue-400'
                : 'text-red-400'
            }
          >
            ${difference}
          </span>
        </div>

        <Button onClick={onSubmit} className="w-full">
          Guardar corte
        </Button>

      </div>
    </Card>
  );
};