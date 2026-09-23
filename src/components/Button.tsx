import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

/**
 * Quy chuẩn button MedDecode:
 * - Chủ đạo #0F766E (teal-700)
 * - Vùng chạm tối thiểu 44x44px
 * - Bo góc 8px (rounded-lg)
 * - Các trạng thái: mặc định / đang nhấn / đang xử lý / không khả dụng
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

  const variantClasses = {
    primary:
      'bg-[#0F766E] text-white hover:bg-[#0D655E] focus:ring-[#0F766E] shadow-sm',
    secondary:
      'bg-slate-100 text-[#0F172A] hover:bg-slate-200 focus:ring-slate-300',
    outline:
      'border border-slate-300 bg-white text-[#0F172A] hover:bg-slate-50 focus:ring-[#0F766E]',
    danger:
      'border border-red-200 bg-red-50 text-[#B91C1C] hover:bg-red-100 focus:ring-red-400',
  }[variant];

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-base px-5 py-2.5 gap-2',
    lg: 'text-lg px-6 py-3.5 gap-2.5',
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
