import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Save,
  Check,
  AlertCircle,
  History,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import Button from '../components/Button';
import IndicatorCard from '../components/IndicatorCard';
import { useApp } from '../context/AppContext';
import { tinhTrangThaiChiSo } from '../data/labDictionary';

/**
 * Màn hình 4: Dashboard kết quả (FR04, FR06)
 * - Ngày xét nghiệm ở đầu
 * - Danh sách "thẻ chỉ số" theo thứ tự quy định:
 *   tên chỉ số -> giá trị + đơn vị -> khoảng tham chiếu -> thanh đo trực quan -> nhãn trạng thái (màu + chữ)
 * - Bấm vào thẻ -> chuyển đến Chi tiết chỉ số (FR05)
 * - Nút "Lưu kết quả" nổi bật (ghi vào Firestore savedReports)
 * - Thông báo: Lưu thành công ("Đã lưu kết quả vào lịch sử xét nghiệm.") hoặc Lưu thất bại (dùng đúng nguyên văn mục 7)
 */
export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentReport, saveReportToFirestore } = useApp();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

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

  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    const res = await saveReportToFirestore({
      ngayXetNghiem: currentReport.ngayXetNghiem,
      nhanPhieu: currentReport.nhanPhieu || `Phiếu xét nghiệm ${currentReport.ngayXetNghiem}`,
      chiSo: currentReport.chiSo,
    });

    setIsSaving(false);

    if (res.success) {
      // Đúng nguyên văn mục 7: "Đã lưu kết quả vào lịch sử xét nghiệm."
      setSaveSuccessMsg('Đã lưu kết quả vào lịch sử xét nghiệm.');
      setHasSaved(true);
    } else {
      // Đúng nguyên văn mục 7: "Chưa lưu được kết quả. Thông tin bạn đã nhập vẫn được giữ trong phiên này."
      setSaveErrorMsg(
        'Chưa lưu được kết quả. Thông tin bạn đã nhập vẫn được giữ trong phiên này.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header thanh điều hướng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/verify')}
            className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] hover:underline mb-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại chỉnh sửa dữ liệu</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0F172A]">Tổng quan kết quả xét nghiệm</h1>
          </div>
          {/* Ngày xét nghiệm ở đầu */}
          <div className="flex items-center gap-2 text-sm text-[#475569] mt-1">
            <Calendar className="w-4 h-4 text-[#0F766E]" />
            <span>
              Ngày xét nghiệm: <strong className="text-slate-800">{currentReport.ngayXetNghiem}</strong>
            </span>
            <span>•</span>
            <span>{currentReport.chiSo.length} chỉ số</span>
          </div>
        </div>

        {/* Nút "Lưu kết quả" nổi bật (ghi vào Firestore) */}
        <div className="flex items-center gap-2">
          <Button
            variant={hasSaved ? 'outline' : 'primary'}
            size="lg"
            isLoading={isSaving}
            loadingText="Đang lưu vào Firestore..."
            icon={hasSaved ? <Check className="w-5 h-5 text-emerald-600" /> : <Save className="w-5 h-5" />}
            onClick={handleSaveToFirestore}
            disabled={hasSaved}
          >
            {hasSaved ? 'Đã lưu' : 'Lưu kết quả'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<History className="w-5 h-5" />}
            onClick={() => navigate('/history')}
            title="Đến lịch sử xét nghiệm"
          >
            Lịch sử
          </Button>
        </div>
      </div>

      {/* Thông báo Lưu thành công (dùng đúng nguyên văn mục 7) */}
      {saveSuccessMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-left flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">{saveSuccessMsg}</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Bạn có thể tiếp tục xem phiếu này hoặc mở Lịch sử để đối chiếu với các lần khám trước.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
            className="shrink-0 text-emerald-800 border-emerald-300 bg-white"
          >
            Xem lịch sử
          </Button>
        </div>
      )}

      {/* Thông báo Lưu thất bại (dùng đúng nguyên văn mục 7) */}
      {saveErrorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50/90 p-4 text-left flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#B91C1C]">{saveErrorMsg}</p>
              <p className="text-xs text-slate-700 mt-0.5">
                Vui lòng kiểm tra lại kết nối mạng và thử bấm &quot;Lưu kết quả&quot; lần nữa.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToFirestore}
            className="shrink-0 text-[#B91C1C] border-red-300 bg-white"
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Tóm tắt nhanh số lượng chỉ số (trung tính, không kết luận bệnh) */}
      <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-center">
        <div className="p-2">
          <p className="text-xs text-[#475569]">Trong khoảng tham chiếu</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{summaryCounts.normal}</p>
        </div>
        <div className="p-2 border-x border-slate-100">
          <p className="text-xs text-[#475569]">Ngoài khoảng tham chiếu</p>
          <p className="text-2xl font-bold text-[#92400E] mt-1">{summaryCounts.outside}</p>
        </div>
        <div className="p-2">
          <p className="text-xs text-[#475569]">Chưa đủ thông tin</p>
          <p className="text-2xl font-bold text-slate-500 mt-1">{summaryCounts.incomplete}</p>
        </div>
      </div>

      {/* Danh sách Thẻ chỉ số */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A]">
            Danh sách chỉ số (chạm để xem chi tiết & ý nghĩa)
          </h2>
          <span className="text-xs text-[#475569]">10 chỉ số</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentReport.chiSo.map((item) => (
            <IndicatorCard
              key={item.ma}
              item={item}
              onClick={() => {
                // Điều hướng sang Chi tiết chỉ số kèm theo mã và phiếu hiện tại
                navigate(`/indicator/${item.ma}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
