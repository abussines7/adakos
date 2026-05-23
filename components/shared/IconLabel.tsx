// src/components/shared/IconLabel.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconLabelProps {
  icon: LucideIcon;
  text: string;
  className?: string;
}

export default function IconLabel({ icon: Icon, text, className = '' }: IconLabelProps) {
  return (
    <div className={`flex items-center gap-2 text-slate-600 ${className}`}>
      <Icon size={16} className="shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );
}