/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarItem = ({ item }: { item: any }) => {
  const pathname = usePathname();

  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 p-3 rounded-xl transition
        ${isActive 
          ? 'bg-green-600 text-white' 
          : 'text-zinc-300 hover:bg-zinc-800'}
      `}
    >
      <span>{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </Link>
  );
};