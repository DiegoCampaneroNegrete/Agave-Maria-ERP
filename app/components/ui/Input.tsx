'use client';

import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-app-muted">
          {label}
        </label>
      )}

      <input
        className={clsx(
          `
          bg-app-card
          border border-app-border
          text-app-text
          rounded-xl
          px-4 py-3
          outline-none
          transition
          focus:border-app-primary
          `,
          error && 'border-red-500',
          className
        )}
        {...props}
      />

      {error && (
        <span className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
};