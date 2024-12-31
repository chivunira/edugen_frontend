// src/components/common/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'px-8 py-2 rounded-md transition-colors font-comic',
        {
          'bg-primary text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;