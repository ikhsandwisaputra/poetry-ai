// src/components/ui/Button.tsx
'use client';

import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'social';
};

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const baseClasses = 'font-semibold transition-transform transform active:scale-95 flex items-center justify-center';

  const variants = {
    primary: 'w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800',
    social: 'bg-white border border-gray-200 p-3 rounded-full hover:bg-gray-50',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}