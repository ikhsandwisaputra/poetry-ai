// src/components/ui/Input.tsx
'use client';

import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends ComponentProps<'input'> {
  id: string;
}

export function Input({ id, type, ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={isPasswordField && isPasswordVisible ? 'text' : type}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none transition-shadow"
        {...props}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
          aria-label={isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}