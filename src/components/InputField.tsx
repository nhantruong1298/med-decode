import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  error?: string;
  warning?: string;
  helperText?: string;
}

/**
 * InputField theo quy chuẩn MedDecode:
 * - Bo góc 8px (rounded-lg)
 * - Vùng chạm tối thiểu 44px
 * - Nhãn rõ ràng, hiển thị đơn vị, thông báo lỗi/cảnh báo inline
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  unit,
  error,
  warning,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  let borderState = 'border-slate-300 focus:border-[#0F766E] focus:ring-[#0F766E]';
  if (error) {
    borderState = 'border-[#B91C1C] ring-1 ring-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C] bg-red-50/30';
  } else if (warning) {
    borderState = 'border-amber-400 ring-1 ring-amber-400 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/20';
  }

  return (
    <div className="w-full text-left space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium text-[#0F172A]">
          {label}
        </label>
        {unit && (
          <span className="text-xs font-normal text-[#475569] bg-slate-100 px-2 py-0.5 rounded">
            {unit}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={inputId}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-white text-[#0F172A] text-base placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500 ${borderState} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-[#B91C1C] mt-1 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}

      {warning && !error && (
        <p className="flex items-start gap-1.5 text-xs text-[#92400E] mt-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>{warning}</span>
        </p>
      )}

      {helperText && !error && !warning && (
        <p className="text-xs text-[#475569]">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
