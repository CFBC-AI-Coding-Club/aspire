import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'blue' | 'teal' | 'coral' | 'yellow' | 'none';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  gradient = 'none',
  hover = false,
}: CardProps) {
  const baseStyles = 'rounded-[24px] p-6 transition-all duration-300';

  const gradientStyles = {
    blue: 'bg-gradient-to-br from-[#E3F5FF] to-[#B8E6FF]',
    teal: 'bg-gradient-to-br from-[#E3F9F7] to-[#2EC4B6] bg-opacity-10',
    coral: 'bg-gradient-to-br from-[#FFE8E6] to-[#FFD4D0]',
    yellow: 'bg-gradient-to-br from-[#FFF4D6] to-[#FFE4A3]',
    none: 'bg-white',
  };

  const hoverStyles = hover
    ? 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02]'
    : '';

  return (
    <div className={`${baseStyles} ${gradientStyles[gradient]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
