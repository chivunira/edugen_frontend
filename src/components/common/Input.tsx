// src/components/common/Input.tsx
import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-comic mb-1">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-comic",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-red-500 text-sm font-comic">{error}</p>
      )}
    </div>
  );
};

export default Input;