import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Columns,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import {
  DANH_SACH_MA_CHI_SO,
  THU_VIEN_CHI_SO,
  tinhTrangThaiChiSo,
} from '../data/labDictionary';

/**
 * Màn hình 7: So sánh kết quả (FR08)
 * - Hai cột / ngày xét nghiệm đặt cạnh nhau
 * - Mỗi chỉ số hiển thị giá trị - đơn vị - khoảng tham chiếu của cả hai phiếu
 * - Nếu thiếu chỉ số tương ứng hoặc khác đơn vị -> hiển thị thông báo giới hạn (mục 7) thay vì so sánh sai:
 *   "Hai phiếu chưa có chỉ số tương ứng." hoặc "Chưa hỗ trợ so sánh hai kết quả khác đơn vị."
 * - Nút "Thay đổi lựa chọn" quay lại Lịch sử
 */
export const CompareScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { savedReports } = useApp();

  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  const report1 = savedReports.find((r) => r.id === id1);
  const report2 = savedReports.find((r) => r.id === id2);

  // Kiểm tra điều kiện đủ 2 phiếu
  if (!report1 || !report2) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-3 bg-amber-50 text-[#92400E] rounded-full inline-block">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#0F172A]">
          Cần hai phiếu đã lưu để sử dụng chức năng so sánh.
        </h2>
        <p className="text-sm text-[#475569]">
          Vui lòng quay lại màn hình Lịch sử và chọn đúng 2 phiếu xét nghiệm để tiến hành so sánh đối chiếu.
        </p>
        <Button variant="primary" onClick={() => navigate('/history')}>
          Quay lại Lịch sử
        </Button>
      </div>
    );
  }

  // Sắp xếp theo thứ tự thời gian: Phiếu cũ trước (Cột 1), Phiếu mới sau (Cột 2)
  const isReport1Older =
    new Date(report1.ngayXetNghiem).getTime() <= new Date(report2.ngayXetNghiem).getTime();
  const olderReport = isReport1Older ? report1 : report2;
  const newerReport = isReport1Older ? report2 : report1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Tiêu đề & nút Thay đổi lựa chọn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] hover:underline mb-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Lịch sử</span>
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Columns className="w-6 h-6 text-[#0F766E]" />
            <span>So sánh diễn tiến kết quả xét nghiệm</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Đối chiếu số liệu giữa 2 thời điểm để quan sát sự thay đổi của từng chỉ số.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/history')}
          className="shrink-0"
        >
          Thay đổi lựa chọn
        </Button>
      </div>

      {/* Thông tin 2 phiếu đặt cạnh nhau */}
      <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-left">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Phiếu lần trước
          </span>
          <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
            {olderReport.nhanPhieu}
          </h3>
          <p className="text-xs text-[#475569] mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Ngày: {olderReport.ngayXetNghiem}</span>
          </p>
        </div>

        <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-200">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#0F766E]">
            Phiếu gần nhất
          </span>
          <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
            {newerReport.nhanPhieu}
          </h3>
          <p className="text-xs text-[#475569] mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Ngày: {newerReport.ngayXetNghiem}</span>
          </p>
        </div>
      </div>

      {/* Bảng so sánh 10 chỉ số */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-left">
          <span className="text-sm font-bold text-[#0F172A]">
            Bảng đối chiếu chi tiết 10 chỉ số xét nghiệm máu
          </span>
          <span className="text-xs text-[#475569]">
            Khoảng tham chiếu chuẩn minh họa
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {DANH_SACH_MA_CHI_SO.map((ma) => {
            const def = THU_VIEN_CHI_SO[ma];
            const item1 = olderReport.chiSo.find((c) => c.ma === ma);
            const item2 = newerReport.chiSo.find((c) => c.ma === ma);

            // Kiểm tra trường hợp thiếu chỉ số tương ứng (theo mục 7)
            const isMissingInEither =
              !item1 ||
              !item2 ||
              item1.giaTri === '' ||
              item1.giaTri === null ||
              item2.giaTri === '' ||
              item2.giaTri === null;

            // Kiểm tra trường hợp khác đơn vị (theo mục 7)
            const isDifferentUnit =
              item1 && item2 && item1.donVi && item2.donVi && item1.donVi !== item2.donVi;

            const status1 = item1 ? tinhTrangThaiChiSo(item1.giaTri, ma) : 'Chưa đủ thông tin';
            const status2 = item2 ? tinhTrangThaiChiSo(item2.giaTri, ma) : 'Chưa đủ thông tin';

            // Tính độ chênh lệch nếu cả 2 đều là số hợp lệ và cùng đơn vị
            const val1 = item1 && item1.giaTri !== '' && !isNaN(Number(item1.giaTri)) ? Number(item1.giaTri) : null;
            const val2 = item2 && item2.giaTri !== '' && !isNaN(Number(item2.giaTri)) ? Number(item2.giaTri) : null;
            const hasValidDiff = val1 !== null && val2 !== null && !isDifferentUnit;
            const diff = hasValidDiff ? Number((val2 - val1).toFixed(2)) : null;

            return (
              <div
                key={ma}
                className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors text-left space-y-3"
              >
                {/* Dòng 1: Tiêu đề chỉ số & Khoảng tham chiếu */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-base text-[#0F172A]">{ma}</span>
                    <span className="text-sm text-[#475569] font-normal ml-2">
                      {def ? def.tenDayDu : ''}
                    </span>
                  </div>
                  <div className="text-xs text-[#475569]">
                    Khoảng tham chiếu: <span className="font-medium text-slate-700">{def?.khoangThamChieuText}</span>
                  </div>
                </div>

                {/* Dòng 2: Nội dung so sánh hoặc Thông báo giới hạn */}
                {isMissingInEither ? (
                  /* Thông báo đúng nguyên văn mục 7: "Hai phiếu chưa có chỉ số tương ứng." */
                  <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-[#92400E] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Hai phiếu chưa có chỉ số tương ứng.</span>
                  </div>
                ) : isDifferentUnit ? (
                  /* Thông báo đúng nguyên văn mục 7: "Chưa hỗ trợ so sánh hai kết quả khác đơn vị." */
                  <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-[#92400E] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Chưa hỗ trợ so sánh hai kết quả khác đơn vị.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
                    {/* Cột 1: Giá trị phiếu cũ */}
                    <div className="sm:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Lần khám {olderReport.ngayXetNghiem}</span>
                        <span className="text-lg font-bold text-[#0F172A]">
                          {item1.giaTri}
                        </span>
                        <span className="text-xs text-[#475569] ml-1">{item1.donVi}</span>
                      </div>
                      <StatusBadge status={status1} size="sm" />
                    </div>

                    {/* Mũi tên biến thiên ở giữa */}
                    <div className="sm:col-span-2 flex flex-col items-center justify-center text-center">
                      {diff !== null && (
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          {diff > 0 ? (
                            <span className="text-slate-700 flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                              <span>+{diff}</span>
                            </span>
                          ) : diff < 0 ? (
                            <span className="text-slate-700 flex items-center gap-0.5">
                              <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                              <span>{diff}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-0.5">
                              <Minus className="w-3.5 h-3.5" />
                              <span>Không đổi</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cột 2: Giá trị phiếu mới */}
                    <div className="sm:col-span-5 bg-teal-50/40 p-3 rounded-lg border border-teal-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#0F766E] block">Lần khám {newerReport.ngayXetNghiem}</span>
                        <span className="text-lg font-bold text-[#0F172A]">
                          {item2.giaTri}
                        </span>
                        <span className="text-xs text-[#475569] ml-1">{item2.donVi}</span>
                      </div>
                      <StatusBadge status={status2} size="sm" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ghi chú chân trang */}
      <div className="p-4 bg-slate-100 rounded-lg text-xs text-[#475569] text-left">
        <p className="font-semibold text-slate-700 mb-0.5">Ghi chú về tính năng so sánh:</p>
        <p>
          Bảng so sánh giúp người dùng theo dõi chiều hướng tăng giảm số học thuần túy giữa 2 thời điểm. Mọi biến động cần được giải thích bởi bác sĩ chuyên khoa trong bệnh cảnh lâm sàng cụ thể.
        </p>
      </div>
    </div>
  );
};

export default CompareScreen;
