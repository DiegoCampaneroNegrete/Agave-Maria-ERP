import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type Size = 'sm' | 'md' | 'lg';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}