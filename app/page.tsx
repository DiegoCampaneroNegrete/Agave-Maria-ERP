'use client';

import { useEffect } from 'react';
import { initDatabase } from '@/lib/db/init';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">🍹 Agave POS</h1>

      <Link
        href="/orders"
        className="bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Ir al POS
      </Link>
    </div>
  );
}