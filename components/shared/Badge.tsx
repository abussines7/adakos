// src/components/shared/Badge.tsx
import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-800',
  primary: 'bg-blue-100 text-blue-800',
};

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}