'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Props {
  onAdd: (data: { name: string; price: number }) => Promise<void>;
}

export const ProductForm = ({ onAdd }: Props) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) return;

    setLoading(true);

    await onAdd({
      name,
      price: Number(price),
    });

    setName('');
    setPrice('');
    setLoading(false);
  };

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Button className='bg-amber-950' loading={loading}>
          Agregar producto
        </Button>
      </form>
    </Card>
  );
};