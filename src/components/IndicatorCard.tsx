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
      className={`bg-white rounded-lg p-5 border border-slate-200 shadow-xs hover:border-[#0F766E]/40 hover:shadow-md transition-all text-left ${
        onClick ? 'cursor-pointer active:bg-slate-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {/* 1. Tên chỉ số */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#0F172A]">{item.ma}</span>
            <span className="text-sm text-[#475569] font-normal truncate max-w-[200px] sm:max-w-xs">
              • {tenHienThi}
            </span>
          </div>

          {/* 2. Giá trị + đơn vị */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
              {giaTriHienThi}
            </span>
            <span className="text-sm font-medium text-[#475569]">{donViHienThi}</span>
          </div>
        </div>

        {/* 5. Nhãn trạng thái (màu + chữ) */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={status} size="sm" />
          {showChevron && (
            <ChevronRight className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
          )}
        </div>
      </div>

      {/* 3. Khoảng tham chiếu */}
      <div className="mt-3 text-xs text-[#475569] flex items-center justify-between">
        <span>Khoảng tham chiếu:</span>
        <span className="font-medium text-slate-700">{khoangThamChieuText}</span>
      </div>

      {/* 4. Thanh đo trực quan */}
      <div className="mt-2.5 pt-1">
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          {/* Vùng tham chiếu bình thường (xanh lá nhạt) */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-200/80 rounded-sm"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
          {/* Con trỏ giá trị hiện tại */}
          {item.giaTri !== null && item.giaTri !== undefined && item.giaTri !== '' && (
            <div
              className={`absolute top-0 bottom-0 w-2 -ml-1 rounded-full shadow-sm transition-all duration-300 ${
                status === 'Trong khoảng tham chiếu'
                  ? 'bg-emerald-600'
                  : 'bg-[#92400E]'
              }`}
              style={{ left: `${Math.min(99, Math.max(1, ratioPercent))}%` }}
            />
          )}
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Thấp</span>
          <span className="text-emerald-700 font-medium">Bình thường</span>
          <span>Cao</span>
        </div>
      </div>
    </div>
  );
};

export default IndicatorCard;
