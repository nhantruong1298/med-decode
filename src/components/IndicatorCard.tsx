import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  ChiSoItem,
  THU_VIEN_CHI_SO,
  tinhTrangThaiChiSo,
  tinhPhanTramThanhDo,
} from '../data/labDictionary';
import StatusBadge from './StatusBadge';

interface IndicatorCardProps {
  item: ChiSoItem;
  onClick?: () => void;
  showChevron?: boolean;
}

/**
 * IndicatorCard tuân thủ đúng thứ tự hiển thị tại mục 4 & mục 8:
 * Tên chỉ số -> Giá trị + Đơn vị -> Khoảng tham chiếu -> Thanh đo trực quan -> Nhãn trạng thái (màu + chữ)
 * Thiết kế giao diện y tế bình tĩnh (Calm Medical UI):
 * - Thanh đo trực quan với dải chuẩn màu ngọc nhạt và con trỏ định vị chính xác
 * - Không gây giật mình bằng màu đỏ
 * - Thể hiện nhóm chuyên môn tinh tế
 */
export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  item,
  onClick,
  showChevron = true,
}) => {
  const def = THU_VIEN_CHI_SO[item.ma];
  const tenHienThi = def ? def.tenDayDu : item.ma;
  const status = tinhTrangThaiChiSo(item.giaTri, item.ma);
  const { ratioPercent, minPercent, maxPercent } = tinhPhanTramThanhDo(item.giaTri, item.ma);

  const giaTriHienThi =
    item.giaTri !== null && item.giaTri !== undefined && item.giaTri !== ''
      ? String(item.giaTri)
      : '—';

  const donViHienThi = item.donVi || (def ? def.donVi : '');
  const khoangThamChieuText = def ? def.khoangThamChieuText : 'Chưa có thông tin';

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-[#0F766E]/50 hover:shadow-md transition-all text-left relative overflow-hidden ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      }`}
    >
      {/* Chỉ báo viền tinh tế phía trên thẻ khi có giá trị cần chú ý */}
      {(status === 'Thấp hơn' || status === 'Cao hơn') && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/80" />
      )}
      {status === 'Trong khoảng tham chiếu' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/60" />
      )}

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1 min-w-0 flex-1">
          {/* Nhóm chỉ số nhỏ */}
          {def?.nhom && (
            <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
              {def.nhom}
            </span>
          )}

          {/* 1. Tên chỉ số */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-[#0F172A] tracking-tight group-hover:text-[#0F766E] transition-colors">
              {item.ma}
            </span>
            <span className="text-sm text-[#475569] font-normal truncate max-w-[180px] sm:max-w-xs">
              • {tenHienThi}
            </span>
          </div>

          {/* 2. Giá trị + đơn vị */}
          <div className="pt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              {giaTriHienThi}
            </span>
            <span className="text-sm font-medium text-[#475569]">{donViHienThi}</span>
          </div>
        </div>

        {/* 5. Nhãn trạng thái (màu + chữ) */}
        <div className="flex flex-col items-end gap-2.5 shrink-0 pt-0.5">
          <StatusBadge status={status} size="sm" />
          {showChevron && (
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#0F766E] group-hover:bg-teal-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Khoảng tham chiếu */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#475569] flex items-center justify-between">
        <span>Khoảng tham chiếu:</span>
        <span className="font-semibold text-slate-700">{khoangThamChieuText}</span>
      </div>

      {/* 4. Thanh đo trực quan */}
      <div className="mt-2.5 pt-1 space-y-1.5">
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          {/* Vùng tham chiếu bình thường (xanh lá nhạt) */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-200/90 rounded-sm"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
          {/* Con trỏ giá trị hiện tại */}
          {item.giaTri !== null && item.giaTri !== undefined && item.giaTri !== '' && (
            <div
              className={`absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full shadow-md transition-all duration-300 ring-2 ring-white ${
                status === 'Trong khoảng tham chiếu'
                  ? 'bg-emerald-600'
                  : 'bg-[#92400E]'
              }`}
              style={{ left: `${Math.min(98, Math.max(2, ratioPercent))}%` }}
            />
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <span>Thấp</span>
          <span className="text-emerald-700">Chuẩn</span>
          <span>Cao</span>
        </div>
      </div>
    </div>
  );
};

export default IndicatorCard;
