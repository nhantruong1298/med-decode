import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  History,
  PlusCircle,
  Columns,
  Calendar,
  ChevronRight,
  AlertCircle,
  Eye,
  Loader2,
  RefreshCw,
  TrendingUp,
  Printer,
  Search,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PrintReportModal } from '../components/PrintReportModal';
import { useApp } from '../context/AppContext';
import {
  SavedReport,
  tinhTrangThaiChiSo,
  THU_VIEN_CHI_SO,
} from '../data/labDictionary';

/**
 * Màn hình 6: Lịch sử xét nghiệm (FR07, FR08)
 * Nâng cấp tính năng y tế:
 * - Nút liên kết trực tiếp sang phân tích Xu hướng (Trends)
 * - Tích hợp xem trước và in phiếu xét nghiệm chuẩn y khoa
 * - Thanh tìm kiếm nhanh phiếu theo ngày hoặc tên
 */
export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    savedReports,
    isLoadingReports,
    loadSavedReports,
    compareSelectedIds,
    toggleCompareSelect,
    setCurrentReport,
    setIsDirty,
    currentUser,
  } = useApp();

  const [compareAlert, setCompareAlert] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [filterPatientOnly, setFilterPatientOnly] = useState<boolean>(true);
  const [printReportData, setPrintReportData] = useState<SavedReport | null>(null);

  const filteredReports = useMemo(() => {
    let list = savedReports;

    if (filterPatientOnly && currentUser) {
      list = list.filter(
        (r) =>
          (r.patientId && r.patientId === currentUser.id) ||
          (r.patientName && r.patientName.toLowerCase() === currentUser.hoTen.toLowerCase()) ||
          (!r.patientId && currentUser.id === 'user-1')
      );
    }

    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter(
      (r) =>
        r.ngayXetNghiem.toLowerCase().includes(q) ||
        r.nhanPhieu.toLowerCase().includes(q) ||
        (r.patientName && r.patientName.toLowerCase().includes(q))
    );
  }, [savedReports, searchFilter, filterPatientOnly, currentUser]);

  const handleStartCompare = () => {
    if (compareSelectedIds.length !== 2) {
      // Đúng nguyên văn mục 7: "Cần hai phiếu đã lưu để sử dụng chức năng so sánh."
      setCompareAlert('Cần hai phiếu đã lưu để sử dụng chức năng so sánh.');
      return;
    }
    setCompareAlert(null);
    navigate(`/compare?id1=${compareSelectedIds[0]}&id2=${compareSelectedIds[1]}`);
  };

  // Mở 1 phiếu cũ lên xem trong Dashboard
  const handleViewReport = (report: SavedReport) => {
    setCurrentReport({
      ngayXetNghiem: report.ngayXetNghiem,
      nhanPhieu: report.nhanPhieu,
      chiSo: [...report.chiSo],
    });
    setIsDirty(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Tiêu đề & thanh công cụ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <History className="w-6 h-6 text-[#0F766E]" />
            <span>Lịch sử xét nghiệm</span>
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Quản lý các phiếu xét nghiệm đã lưu trữ an toàn trong Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Nút Xu hướng */}
          <Link
            to="/trends"
            className="px-3.5 py-2 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-teal-700" />
            <span>Xem xu hướng</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => loadSavedReports()}
            disabled={isLoadingReports}
            title="Làm mới dữ liệu từ Firestore"
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/upload')}
          >
            Thêm phiếu mới
          </Button>
        </div>
      </div>

      {/* Thông tin bệnh nhân đang xem lịch sử */}
      {currentUser && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {currentUser.hoTen.split(' ').map((n) => n[0]).slice(-2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Hồ sơ:</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser.hoTen}</span>
                <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                  {currentUser.maHoSo}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentUser.gioiTinh} · {new Date().getFullYear() - currentUser.namSinh} tuổi · Nhóm máu: {currentUser.nhomMau}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterPatientOnly(!filterPatientOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                filterPatientOnly
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {filterPatientOnly ? 'Chỉ bệnh nhân này' : 'Tất cả bệnh nhân'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Đổi hồ sơ
            </button>
          </div>
        </div>
      )}

      {/* Thông báo kiểm tra số lượng khi bấm so sánh */}
      {compareAlert && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-left flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#92400E]">{compareAlert}</p>
              <p className="text-xs text-slate-700 mt-0.5">
                Vui lòng tích chọn đúng 2 ô vuông tương ứng với 2 phiếu xét nghiệm để đối chiếu.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCompareAlert(null)}
            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Thanh công cụ so sánh khi có từ 2 phiếu trở lên */}
      {savedReports.length >= 2 && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-medium text-slate-800">
              Đã chọn{' '}
              <strong className="text-[#0F766E]">{compareSelectedIds.length}/2</strong> phiếu để so sánh
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Columns className="w-4 h-4" />}
            onClick={handleStartCompare}
            disabled={compareSelectedIds.length !== 2}
          >
            So sánh 2 phiếu đã chọn
          </Button>
        </div>
      )}

      {/* Ô tìm kiếm nhanh phiếu */}
      {savedReports.length > 2 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Tìm theo ngày (2026-...) hoặc tên phiếu..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      )}

      {/* Loading state */}
      {isLoadingReports && (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0F766E]" />
          <p className="text-sm">Đang tải lịch sử xét nghiệm từ Firestore...</p>
        </div>
      )}

      {/* Trạng thái rỗng: Lịch sử trống (dùng đúng nguyên văn mục 7) */}
      {!isLoadingReports && savedReports.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Bạn chưa có kết quả xét nghiệm đã lưu.
            </h3>
            <p className="text-sm text-[#475569] max-w-md mx-auto">
              Hãy thêm kết quả xét nghiệm đầu tiên để bắt đầu theo dõi sức khỏe một cách khoa học.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/upload')}
          >
            Thêm phiếu xét nghiệm
          </Button>
        </div>
      )}

      {/* Danh sách thẻ phiếu xét nghiệm đã lưu */}
      {!isLoadingReports && savedReports.length > 0 && (
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#475569]">
            * Tích chọn 2 phiếu bằng ô vuông bên trái để kích hoạt nút So sánh kết quả.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => {
              const isSelected = report.id ? compareSelectedIds.includes(report.id) : false;

              // Lấy 4 chỉ số đại diện: WBC, GLU, CHOL, CREA
              const sampleIndicators = ['WBC', 'GLU', 'CHOL', 'CREA']
                .map((code) => report.chiSo.find((c) => c.ma === code))
                .filter(Boolean);

              return (
                <div
                  key={report.id || report.ngayXetNghiem}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-teal-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Cột trái: Checkbox chọn & Thông tin ngày */}
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => report.id && toggleCompareSelect(report.id)}
                        className="w-5 h-5 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                        title="Chọn phiếu này để so sánh"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#0F766E]" />
                        <h3 className="text-base font-bold text-[#0F172A]">
                          {report.nhanPhieu}
                        </h3>
                      </div>
                      <p className="text-xs text-[#475569]">
                        Ngày lấy mẫu: <strong className="text-slate-700">{report.ngayXetNghiem}</strong> • Tổng số: {report.chiSo.length} chỉ số
                      </p>
                    </div>
                  </div>

                  {/* Cột giữa: Vài chỉ số nổi bật */}
                  <div className="flex flex-wrap items-center gap-2 py-2 border-y md:border-y-0 md:border-x border-slate-100 md:px-4">
                    {sampleIndicators.map((ind) => {
                      if (!ind) return null;
                      const status = tinhTrangThaiChiSo(ind.giaTri, ind.ma);
                      return (
                        <div
                          key={ind.ma}
                          className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs flex items-center gap-1.5"
                        >
                          <span className="font-semibold text-slate-800">{ind.ma}:</span>
                          <span className="text-slate-900 font-bold">{ind.giaTri ?? '—'}</span>
                          <span className="text-[10px] text-slate-500">{ind.donVi}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === 'Trong khoảng tham chiếu'
                                ? 'bg-emerald-500'
                                : 'bg-[#92400E]'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Cột phải: Các nút thao tác */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => setPrintReportData(report)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                      title="In phiếu xét nghiệm này"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => handleViewReport(report)}
                    >
                      Xem phiếu
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal in phiếu từ lịch sử */}
      {printReportData && (
        <PrintReportModal
          isOpen={true}
          onClose={() => setPrintReportData(null)}
          report={printReportData}
        />
      )}
    </div>
  );
};

export default HistoryScreen;
