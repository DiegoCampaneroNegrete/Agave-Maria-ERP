'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

type Padding = 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: Padding;
}

export const Card = ({
  children,
  className,
  padding = 'md',
}: CardProps) => {
  const paddings: Record<Padding, string> = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={clsx(
        'bg-app-card rounded-xl shadow-card',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
};