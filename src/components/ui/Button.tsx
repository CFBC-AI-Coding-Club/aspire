import { Button as BaseButton } from '@base-ui-components/react/button';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-[#2E8BC0] text-white hover:bg-[#2579a8] hover:shadow-[0_8px_24px_rgba(46,139,192,0.3)] active:scale-95',
    secondary: 'bg-[#FF6F61] text-white hover:bg-[#FF5A4D] hover:shadow-[0_8px_24px_rgba(255,111,97,0.3)] active:scale-95',
    outline: 'border-2 border-[#2E8BC0] text-[#2E8BC0] hover:bg-[#E3F5FF] active:scale-95',
    ghost: 'text-[#2E8BC0] hover:bg-[#E3F5FF] active:scale-95',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <BaseButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </BaseButton>
  );
}
