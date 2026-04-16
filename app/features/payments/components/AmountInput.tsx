'use client';

import { Input } from '@/components/ui/Input';

interface AmountInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  max?: number;
  error?: string;
}

export const AmountInput = ({ value, onChange, max, error }: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(null);
      return;
    }

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-app-text">
        Monto
        {max && <span className="text-app-muted ml-2">(Max: ${max.toFixed(2)})</span>}
      </label>
      <Input
        type="number"
        step="0.01"
        min="0"
        max={max}
        value={value ?? ''}
        onChange={handleChange}
        placeholder="0.00"
        className="text-lg font-bold"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
