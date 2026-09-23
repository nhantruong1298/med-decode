import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Camera,
  History,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

/**
 * Màn hình 1: Trang chủ
 * - Tên app + giới thiệu ngắn ở đầu
 * - Card nổi bật với nút "Tải ảnh" / "Chụp phiếu"
 * - Lối vào "Lịch sử xét nghiệm"
 * - Điều hướng -> Tải/chụp phiếu; -> Lịch sử
 * - Dòng ghi chú "Hướng phát triển tiếp theo" (mục 2)
 */
export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { savedReports } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header giới thiệu */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-[#0F766E] border border-teal-200/60 shadow-xs mb-1">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          MedDecode
        </h1>
        <p className="text-base text-[#475569] max-w-lg mx-auto leading-relaxed">
          Hỗ trợ người dùng phổ thông đọc hiểu, kiểm tra và theo dõi kết quả xét nghiệm máu của bản thân một cách an toàn và trung tính.
        </p>
      </div>

      {/* Card nổi bật hành động chính: Tải ảnh / Chụp phiếu */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0F766E]">
            Đọc phiếu mới
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Bắt đầu với phiếu xét nghiệm của bạn
          </h2>
          <p className="text-sm text-[#475569]">
            Chọn ảnh đã chụp hoặc mở camera trên thiết bị để đối chiếu thông tin các chỉ số máu cơ bản.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={<Camera className="w-5 h-5" />}
            onClick={() => navigate('/upload')}
            className="w-full justify-center"
          >
            Chụp / Tải ảnh phiếu
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={<History className="w-5 h-5" />}
            onClick={() => navigate('/history')}
            className="w-full justify-center"
          >
            Lịch sử xét nghiệm ({savedReports.length})
          </Button>
        </div>

        {/* Cam kết dữ liệu trung tính & an toàn */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-[#475569] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
          <span>
            Ứng dụng KHÔNG cung cấp chẩn đoán y khoa. Toàn bộ thông tin chỉ nhằm mục đích giúp bạn hiểu rõ các thuật ngữ và chỉ số trên phiếu.
          </span>
        </div>
      </div>

      {/* Lối vào nhanh Lịch sử xét nghiệm gần đây nếu có */}
      {savedReports.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0F766E]" />
              <span>Phiếu gần nhất đã lưu</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-medium text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => navigate('/history')}
            className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold text-[#0F172A]">
                {savedReports[0].nhanPhieu}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">
                Ngày: {savedReports[0].ngayXetNghiem} • {savedReports[0].chiSo.length} chỉ số
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}

      {/* Ghi chú hướng phát triển tiếp theo (mục 2 trong đặc tả) */}
      <div className="rounded-lg bg-slate-100/70 border border-slate-200 p-4 text-left text-xs text-[#475569] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Hướng phát triển tiếp theo: </span>
          <span>
            Tính năng nhận diện tự động bằng AI, tư vấn chuyên gia và mở rộng danh mục xét nghiệm sinh hóa/miễn dịch chuyên sâu sẽ được nghiên cứu trong các phiên bản kế tiếp.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
