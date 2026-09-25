import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Droplets,
  Calculator,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { DisclaimerBanner } from '../components/Disclaimers';
import { useApp } from '../context/AppContext';
import {
  THU_VIEN_CHI_SO,
  DANH_SACH_MA_CHI_SO,
  tinhTrangThaiChiSo,
  tinhPhanTramThanhDo,
} from '../data/labDictionary';

/**
 * Màn hình 5: Chi tiết chỉ số (FR05)
 * Nâng cấp trải nghiệm y khoa toàn diện:
 * - Khoảng tham chiếu theo Giới tính (Nam vs Nữ)
 * - Yếu tố sinh lý ảnh hưởng (nước, đồ ăn, thể thao)
 * - Gợi ý 3 câu hỏi trao đổi cùng Bác sĩ điều trị
 * - Lối tắt sang Biểu đồ xu hướng và Bộ đổi đơn vị
 * - Banner giới hạn diễn giải (mục 6) đúng nguyên văn
 */
export const IndicatorDetailScreen: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { currentReport } = useApp();

  const currentCode = code ? code.toUpperCase() : 'WBC';
  const def = THU_VIEN_CHI_SO[currentCode];
  const currentItem = currentReport?.chiSo.find(
    (c) => c.ma.toUpperCase() === currentCode
  );

  if (!def) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-slate-600">Không tìm thấy thông tin cho chỉ số này.</p>
        <Button onClick={() => navigate('/dashboard')}>Quay lại bảng kết quả</Button>
      </div>
    );
  }

  const currentIndex = DANH_SACH_MA_CHI_SO.indexOf(currentCode);
  const prevCode = currentIndex > 0 ? DANH_SACH_MA_CHI_SO[currentIndex - 1] : null;
  const nextCode =
    currentIndex < DANH_SACH_MA_CHI_SO.length - 1
      ? DANH_SACH_MA_CHI_SO[currentIndex + 1]
      : null;

  const giaTri = currentItem?.giaTri;
  const status = tinhTrangThaiChiSo(giaTri, def.ma);
  const { ratioPercent, minPercent, maxPercent } = tinhPhanTramThanhDo(giaTri, def.ma);

  const giaTriHienThi =
    giaTri !== null && giaTri !== undefined && giaTri !== '' ? String(giaTri) : '—';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Nút quay lại đúng phiếu đang xem */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại phiếu ({currentReport?.ngayXetNghiem || 'Kết quả'})</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/trends"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-200 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Xem biểu đồ xu hướng</span>
          </Link>

          {currentReport?.ngayXetNghiem && (
            <div className="flex items-center gap-1.5 text-xs text-[#475569]">
              <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Ngày: {currentReport.ngayXetNghiem}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bộ chuyển nhanh chỉ số */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Chỉ số khác:</span>
        {DANH_SACH_MA_CHI_SO.map((m) => (
          <button
            key={m}
            onClick={() => navigate(`/indicator/${m}`)}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              m === currentCode
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Khối đầu trang: Tên đầy đủ + Giá trị nổi bật */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left shadow-xs relative overflow-hidden">
        {/* Nhãn nhóm chuyên môn & cơ quan */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E]">
          <Layers className="w-4 h-4" />
          <span>Nhóm xét nghiệm: {def.nhom}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">{def.coQuan}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
              {def.tenDayDu}
            </h1>
            <p className="text-sm text-[#475569] mt-0.5">Ký hiệu viết tắt: <strong>{def.ma}</strong></p>
          </div>

          <StatusBadge status={status} size="lg" className="self-start sm:self-auto" />
        </div>

        {/* Khối giá trị và khoảng tham chiếu */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs text-[#475569]">Giá trị ghi nhận trên phiếu:</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">{giaTriHienThi}</span>
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
            <span>Vị trí trên thước đo</span>
            <span className="font-medium text-slate-700">Dải chuẩn: {def.thamChieuMin} – {def.thamChieuMax} {def.donVi}</span>
          </div>

          <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-emerald-200/90 rounded-xs"
              style={{
                left: `${minPercent}%`,
                width: `${Math.max(0, maxPercent - minPercent)}%`,
              }}
            />
            {giaTri !== null && giaTri !== undefined && giaTri !== '' && (
              <div
                className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full shadow-md ring-2 ring-white ${
                  status === 'Trong khoảng tham chiếu' ? 'bg-emerald-600' : 'bg-[#92400E]'
                }`}
                style={{ left: `${Math.min(98, Math.max(2, ratioPercent))}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Dưới tham chiếu</span>
            <span className="text-emerald-700 font-semibold">Khoảng bình thường</span>
            <span>Vượt tham chiếu</span>
          </div>
        </div>

        {/* Khoảng tham chiếu theo Giới tính */}
        <div className="bg-teal-50/40 rounded-xl p-3.5 border border-teal-100 text-xs space-y-2">
          <span className="font-semibold text-teal-900 block">
            Khoảng chuẩn theo giới tính:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div className="bg-white p-2.5 rounded-lg border border-teal-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Nam giới:</span>
              <span className="font-bold text-teal-800 font-mono">{def.thamChieuNam.text}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-teal-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Nữ giới:</span>
              <span className="font-bold text-teal-800 font-mono">{def.thamChieuNu.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Khối: Ý nghĩa chỉ số */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0F766E]" />
          <span>Ý nghĩa chỉ số</span>
        </h2>
        <p className="text-base text-[#475569] leading-relaxed">{def.giaiThich}</p>
      </div>

      {/* Khối: Cách đọc kết quả */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F766E]" />
          <span>Cách đọc kết quả</span>
        </h2>
        <p className="text-base text-[#475569] leading-relaxed">{def.cachDoc}</p>
      </div>

      {/* Khối: Yếu tố sinh lý ảnh hưởng */}
      {def.yeuToSinhLy && def.yeuToSinhLy.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <Droplets className="w-5 h-5 text-amber-600" />
            <span>Yếu tố sinh lý thông thường có thể làm thay đổi chỉ số</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-[#475569] leading-relaxed pl-1">
            {def.yeuToSinhLy.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Khối: Gợi ý câu hỏi trao đổi cùng Bác sĩ */}
      {def.cauHoiBacSi && def.cauHoiBacSi.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0F766E]" />
            <span>Gợi ý câu hỏi nên trao đổi với Bác sĩ khi tái khám</span>
          </h2>
          <div className="space-y-2 pt-1">
            {def.cauHoiBacSi.map((q, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Khối: Nguồn tham khảo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-left shadow-xs">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#0F766E]" />
          <span>Nguồn tham khảo</span>
        </h2>
        <p className="text-sm text-[#475569] italic">{def.nguonThamKhao}</p>
      </div>

      {/* Banner giới hạn diễn giải (bắt buộc đúng nguyên văn theo mục 6) */}
      <DisclaimerBanner />

      {/* Nút điều hướng tuần tự Trước / Sau */}
      <div className="flex items-center justify-between pt-2">
        {prevCode ? (
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/indicator/${prevCode}`)}
          >
            Chỉ số trước ({prevCode})
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          Bảng kết quả
        </Button>

        {nextCode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/indicator/${nextCode}`)}
          >
            <span>Chỉ số tiếp ({nextCode})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default IndicatorDetailScreen;
