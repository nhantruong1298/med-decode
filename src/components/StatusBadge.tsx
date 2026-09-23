import React from 'react';
import { StatusType } from '../data/labDictionary';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * StatusBadge tuân thủ nguyên tắc UX dữ liệu y tế trung tính:
 * - 4 nhãn duy nhất: "Trong khoảng tham chiếu", "Thấp hơn", "Cao hơn", "Chưa đủ thông tin"
 * - Luôn kết hợp MÀU SẮC + NHÃN CHỮ
 * - Màu cần chú ý #92400E (nâu vàng), KHÔNG dùng nhãn nguy hiểm hay màu đỏ cho chỉ số.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Trong khoảng tham chiếu':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'Thấp hơn':
        return {
          bg: 'bg-amber-50 text-[#92400E] border-amber-200',
          dot: 'bg-[#92400E]',
        };
      case 'Cao hơn':
        return {
          bg: 'bg-amber-50 text-[#92400E] border-amber-200',
          dot: 'bg-[#92400E]',
        };
      case 'Chưa đủ thông tin':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-base px-3 py-1.5 gap-2 font-medium',
  }[size];

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center rounded-md border ${style.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
