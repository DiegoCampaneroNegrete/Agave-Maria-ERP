'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { Variant, Size } from './types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const base = `
    bg-amber-950
    rounded-xl font-semibold transition
    active:scale-95 text-white
    flex items-center justify-center gap-2
  `;

  const variants: Record<Variant, string> = {
    primary: 'bg-app-primary hover:bg-app-primaryHover text-white',
    secondary: 'bg-app-card hover:bg-app-hover text-app-text',
    danger: 'bg-app-danger hover:bg-red-500 text-white',
    ghost: 'hover:bg-app-hover text-app-text',
  };

  const sizes: Record<Size, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};