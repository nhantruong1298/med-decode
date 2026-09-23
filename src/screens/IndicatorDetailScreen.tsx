import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileCheck,
  Calendar,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { DisclaimerBanner } from '../components/Disclaimers';
import { useApp } from '../context/AppContext';
import {
  THU_VIEN_CHI_SO,
  tinhTrangThaiChiSo,
  tinhPhanTramThanhDo,
} from '../data/labDictionary';

/**
 * Màn hình 5: Chi tiết chỉ số (FR05)
 * - Tên đầy đủ + giá trị nổi bật ở đầu
 * - Các khối: Ý nghĩa chỉ số, Cách đọc kết quả, Nguồn tham khảo
 * - Banner giới hạn diễn giải (mục 6) gần cuối trang
 * - Nút quay lại đúng phiếu đang xem (Dashboard hoặc Report cụ thể)
 */
export const IndicatorDetailScreen: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { currentReport } = useApp();

  const def = code ? THU_VIEN_CHI_SO[code.toUpperCase()] : null;
  const currentItem = currentReport?.chiSo.find(
    (c) => c.ma.toUpperCase() === (code || '').toUpperCase()
  );

  if (!def) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-slate-600">Không tìm thấy thông tin cho chỉ số này.</p>
        <Button onClick={() => navigate('/dashboard')}>Quay lại bảng kết quả</Button>
      </div>
    );
  }

  const giaTri = currentItem?.giaTri;
  const status = tinhTrangThaiChiSo(giaTri, def.ma);
  const { ratioPercent, minPercent, maxPercent } = tinhPhanTramThanhDo(giaTri, def.ma);

  const giaTriHienThi =
    giaTri !== null && giaTri !== undefined && giaTri !== '' ? String(giaTri) : '—';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Nút quay lại đúng phiếu đang xem */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại phiếu đang xem ({currentReport?.ngayXetNghiem || 'Kết quả'})</span>
        </button>

        {currentReport?.ngayXetNghiem && (
          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ngày: {currentReport.ngayXetNghiem}</span>
          </div>
        )}
      </div>

      {/* Khối đầu trang: Tên đầy đủ + Giá trị nổi bật */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Chỉ số xét nghiệm {def.ma}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
              {def.tenDayDu}
            </h1>
            <p className="text-sm text-[#475569] mt-0.5">Mã viết tắt: {def.ma}</p>
          </div>

          <StatusBadge status={status} size="lg" className="self-start sm:self-auto" />
        </div>

        {/* Khối giá trị và khoảng tham chiếu */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs text-[#475569]">Giá trị ghi nhận trên phiếu:</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-[#0F172A]">{giaTriHienThi}</span>
              <span className="text-base font-semibold text-[#475569]">{def.donVi}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#475569]">Khoảng tham chiếu chuẩn:</p>
            <p className="text-base font-bold text-slate-800 mt-1">{def.khoangThamChieuText}</p>
          </div>
        </div>

        {/* Thanh đo trực quan */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs text-[#475569]">
            <span>Vị trí trên dải đo</span>
            <span>Khoảng chuẩn: {def.thamChieuMin} – {def.thamChieuMax}</span>
          </div>

          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-emerald-200/90 rounded-sm"
              style={{
                left: `${minPercent}%`,
                width: `${Math.max(0, maxPercent - minPercent)}%`,
              }}
            />
            {giaTri !== null && giaTri !== undefined && giaTri !== '' && (
              <div
                className={`absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full shadow-md ${
                  status === 'Trong khoảng tham chiếu' ? 'bg-emerald-600' : 'bg-[#92400E]'
                }`}
                style={{ left: `${Math.min(99, Math.max(1, ratioPercent))}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Dưới tham chiếu</span>
            <span className="text-emerald-700 font-medium">Khoảng bình thường</span>
            <span>Vượt tham chiếu</span>
          </div>
        </div>
      </div>

      {/* Khối: Ý nghĩa chỉ số */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0F766E]" />
          <span>Ý nghĩa chỉ số</span>
        </h2>
        <p className="text-base text-[#475569] leading-relaxed">{def.giaiThich}</p>
      </div>

      {/* Khối: Cách đọc kết quả */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F766E]" />
          <span>Cách đọc kết quả</span>
        </h2>
        <p className="text-base text-[#475569] leading-relaxed">{def.cachDoc}</p>
      </div>

      {/* Khối: Nguồn tham khảo */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#0F766E]" />
          <span>Nguồn tham khảo</span>
        </h2>
        <p className="text-sm text-[#475569] italic">{def.nguonThamKhao}</p>
      </div>

      {/* Banner giới hạn diễn giải (bắt buộc đúng nguyên văn theo mục 6) */}
      <DisclaimerBanner />

      {/* Nút quay lại phiếu */}
      <div className="pt-2 text-center">
        <Button
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
        >
          Quay lại bảng kết quả
        </Button>
      </div>
    </div>
  );
};

export default IndicatorDetailScreen;
