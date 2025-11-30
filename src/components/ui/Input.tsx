import { Input as BaseInput } from '@base-ui-components/react/input';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  name,
}: InputProps) {
  const baseStyles = 'w-full px-4 py-3 rounded-xl border-2 border-[#E8EFF2] bg-white text-[#1B262C] placeholder:text-[#7D8B91] placeholder:opacity-60 transition-all duration-300 focus:outline-none focus:border-[#2E8BC0] focus:shadow-[0_4px_16px_rgba(46,139,192,0.2)]';

  return (
    <BaseInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      name={name}
      className={`${baseStyles} ${className}`}
    />
  );
}
