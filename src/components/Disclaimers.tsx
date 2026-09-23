import React from 'react';
import { Info, Lock } from 'lucide-react';

/**
 * Banner giới hạn diễn giải hiển thị ở màn hình Chi tiết chỉ số (mục 6):
 * Dùng ĐÚNG NGUYÊN VĂN:
 * "MedDecode hỗ trợ đọc hiểu thông tin trên phiếu xét nghiệm, không cung cấp kết luận chẩn đoán.
 *  Chỉ số ngoài khoảng tham chiếu không tự xác nhận một bệnh.
 *  Bạn có thể trao đổi với nhân viên y tế để được giải thích trong bối cảnh sức khỏe của mình."
 */
export const DisclaimerBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-[#0F172A] ${className}`}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-[#92400E] mb-1">Lưu ý quan trọng</p>
          <p className="text-slate-700">
            MedDecode hỗ trợ đọc hiểu thông tin trên phiếu xét nghiệm, không cung cấp kết luận chẩn đoán. Chỉ số ngoài khoảng tham chiếu không tự xác nhận một bệnh. Bạn có thể trao đổi với nhân viên y tế để được giải thích trong bối cảnh sức khỏe của mình.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Chú thích quyền riêng tư gần khu vực tải ảnh (mục 6):
 * Dùng ĐÚNG NGUYÊN VĂN:
 * "Ảnh phiếu chỉ dùng để xem trước trong phiên làm việc này, không được lưu trữ hoặc gửi đi đâu khác."
 */
export const PrivacyNote: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2 text-xs text-[#475569] bg-slate-100/80 px-3 py-2 rounded-md ${className}`}
    >
      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
      <span>
        Ảnh phiếu chỉ dùng để xem trước trong phiên làm việc này, không được lưu trữ hoặc gửi đi đâu khác.
      </span>
    </div>
  );
};
