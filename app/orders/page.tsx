
'use client';

import { useState } from 'react';

const productsMock = [
  { id: '1', name: 'Cerveza', price: 50 },
  { id: '2', name: 'Tequila', price: 80 },
];

export default function POSPage() {
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; qty: number }>>([]);

  const add = (p: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id);

      if (existing) {
        return prev.map(i =>
          i.id === p.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...p, qty: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Productos */}
      <div className="grid grid-cols-2 gap-2">
        {productsMock.map(p => (
          <button
            key={p.id}
            onClick={() => add(p)}
            className="p-4 bg-zinc-800 text-white rounded-xl"
          >
            {p.name} - ${p.price}
          </button>
        ))}
      </div>

      {/* Carrito */}
      <div>
        {cart.map(item => (
          <div key={item.id}>
            {item.name} x{item.qty}
          </div>
        ))}

        <div className="mt-4 font-bold">
          Total: ${total}
        </div>
      </div>
    </div>
  );
}
