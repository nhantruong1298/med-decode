import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  History,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Printer,
  TrendingUp,
  Droplets,
  Activity,
  Heart,
  Share2,
} from 'lucide-react';
import Button from '../components/Button';
import IndicatorCard from '../components/IndicatorCard';
import { PrintReportModal } from '../components/PrintReportModal';
import { useApp } from '../context/AppContext';
import {
  tinhTrangThaiChiSo,
  THU_VIEN_CHI_SO,
} from '../data/labDictionary';

/**
 * Màn hình 4: Dashboard kết quả (FR04, FR06)
 * Nâng cấp trải nghiệm chuyên nghiệp:
 * - Tích hợp xuất bản in chuẩn y tế / PDF với PrintReportModal
 * - Nút liên kết trực tiếp sang phân tích Xu hướng (Trends)
 * - Tóm tắt tình trạng theo Hệ cơ quan (Organ System Balance)
 * - Bộ lọc chuyên môn phân loại rõ ràng
 */
export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentReport } = useApp();

  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Bộ lọc tương tác
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'outside' | 'incomplete'>('all');

  if (!currentReport) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-slate-600">Chưa có dữ liệu xét nghiệm để hiển thị.</p>
        <Button onClick={() => navigate('/upload')}>Tải phiếu xét nghiệm</Button>
      </div>
    );
  }

  // Thống kê nhanh trạng thái
  const summaryCounts = currentReport.chiSo.reduce(
    (acc, cur) => {
      const status = tinhTrangThaiChiSo(cur.giaTri, cur.ma);
      if (status === 'Trong khoảng tham chiếu') acc.normal++;
      else if (status === 'Thấp hơn' || status === 'Cao hơn') acc.outside++;
      else acc.incomplete++;
      return acc;
    },
    { normal: 0, outside: 0, incomplete: 0 }
  );

  const percentNormal = Math.round((summaryCounts.normal / currentReport.chiSo.length) * 100);

  // Lọc chỉ số theo Tab chuyên môn và Trạng thái
  const filteredIndicators = currentReport.chiSo.filter((item) => {
    const def = THU_VIEN_CHI_SO[item.ma];
    const status = tinhTrangThaiChiSo(item.giaTri, item.ma);

    if (activeGroup !== 'all' && def?.nhom !== activeGroup) {
      return false;
    }

    if (statusFilter === 'normal' && status !== 'Trong khoảng tham chiếu') return false;
    if (statusFilter === 'outside' && status !== 'Thấp hơn' && status !== 'Cao hơn') return false;
    if (statusFilter === 'incomplete' && status !== 'Chưa đủ thông tin') return false;

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header thanh điều hướng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0F172A]">Bảng kết quả xét nghiệm</h1>
          </div>
          {/* Ngày xét nghiệm ở đầu */}
          <div className="flex items-center gap-2 text-sm text-[#475569] mt-1">
            <Calendar className="w-4 h-4 text-[#0F766E]" />
            <span>
              Ngày xét nghiệm: <strong className="text-slate-800">{currentReport.ngayXetNghiem}</strong>
            </span>
            <span>·</span>
            <span>{currentReport.chiSo.length} chỉ số</span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút In phiếu / Xuất PDF */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Xem và in bản báo cáo tóm tắt y khoa"
          >
            <Printer className="w-4 h-4 text-teal-700" />
            <span className="hidden sm:inline">In phiếu / Xuất PDF</span>
            <span className="sm:hidden">In</span>
          </button>

          {/* Nút Xem xu hướng */}
          <button
            onClick={() => navigate('/trends')}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Xem diễn tiến các chỉ số qua thời gian"
          >
            <TrendingUp className="w-4 h-4 text-teal-700" />
            <span className="hidden sm:inline">Xem xu hướng</span>
          </button>

          <Button
            variant="secondary"
            size="md"
            icon={<History className="w-4 h-4" />}
            onClick={() => navigate('/history')}
            title="Đến lịch sử xét nghiệm"
          >
            Lịch sử
          </Button>
        </div>
      </div>

      {/* Card Thống kê nhanh trạng thái - hỗ trợ lọc nhanh khi click */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'normal' ? 'all' : 'normal')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'normal'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Trong khoảng tham chiếu</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800">{summaryCounts.normal}</span>
            <span className="text-xs text-slate-500">/{currentReport.chiSo.length} ({percentNormal}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bấm để lọc nhóm này</p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'outside' ? 'all' : 'outside')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'outside'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ngoài khoảng tham chiếu</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#92400E]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#92400E]">{summaryCounts.outside}</span>
            <span className="text-xs text-slate-500">chỉ số</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cần chú ý trao đổi bác sĩ</p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'incomplete' ? 'all' : 'incomplete')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'incomplete'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Chưa đủ thông tin</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-600">{summaryCounts.incomplete}</span>
            <span className="text-xs text-slate-500">chỉ số</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trường trống hoặc lỗi</p>
        </button>
      </div>

      {/* Segmented Control Lọc theo Chuyên môn y học */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <span>Danh sách chỉ số</span>
            {statusFilter !== 'all' && (
              <span className="text-xs font-normal text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                (Đang lọc trạng thái)
              </span>
            )}
          </h2>
          <span className="text-xs text-[#475569]">
            Hiển thị {filteredIndicators.length}/{currentReport.chiSo.length} chỉ số
          </span>
        </div>

        {/* Tab chuyển phân loại chuyên môn */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveGroup('all')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === 'all'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả (10)
          </button>
          <button
            onClick={() => setActiveGroup('Huyết học')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === 'Huyết học'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Huyết học (5)
          </button>
          <button
            onClick={() => setActiveGroup('Đường huyết & Chuyển hóa')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === 'Đường huyết & Chuyển hóa'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đường & Mỡ máu (2)
          </button>
          <button
            onClick={() => setActiveGroup('Chức năng Thận')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === 'Chức năng Thận'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chức năng Thận (1)
          </button>
          <button
            onClick={() => setActiveGroup('Chức năng Gan')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup === 'Chức năng Gan'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chức năng Gan (2)
          </button>
        </div>

        {/* Danh sách Thẻ chỉ số */}
        {filteredIndicators.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            <p>Không có chỉ số nào phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setActiveGroup('all');
                setStatusFilter('all');
              }}
              className="mt-2 text-xs text-[#0F766E] font-medium hover:underline cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIndicators.map((item) => (
              <IndicatorCard
                key={item.ma}
                item={item}
                onClick={() => {
                  navigate(`/indicator/${item.ma}`);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal In phiếu xét nghiệm y khoa */}
      <PrintReportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        report={currentReport}
      />
    </div>
  );
};

export default DashboardScreen;
