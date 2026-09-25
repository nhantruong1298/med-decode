import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Camera,
  History,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  TrendingUp,
  BookOpen,
  Calculator,
  ClipboardCheck,
  UserCheck,
  Heart,
  Calendar,
} from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { savedReports, currentUser, setIsAuthModalOpen } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero section */}
      <div className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ thống Đọc hiểu & Theo dõi Kết quả Xét nghiệm Máu</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] max-w-2xl mx-auto leading-tight">
          Hỗ trợ đọc hiểu kết quả xét nghiệm máu an toàn và trung tính
        </h1>
        <p className="text-base sm:text-lg text-[#475569] max-w-xl mx-auto leading-relaxed">
          Giúp người dùng tự tin kiểm tra số liệu, hiểu rõ các dải tham chiếu sinh hóa mà không bị hoang mang bởi các cảnh báo gây sợ hãi.
        </p>
      </div>

      {/* THẺ HỒ SƠ BỆNH NHÂN ĐANG HOẠT ĐỘNG (Local Patient Profile Card) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0 ${
              currentUser?.avatarColor || 'bg-teal-600'
            }`}
          >
            {currentUser?.hoTen
              ? currentUser.hoTen
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')
              : 'BN'}
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hồ sơ đang mở:
              </span>
              <span className="font-extrabold text-base text-slate-900">
                {currentUser?.hoTen || 'Khách vãng lai'}
              </span>
              {currentUser && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200">
                  {currentUser.maHoSo}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              {currentUser ? (
                <>
                  <span>
                    {currentUser.gioiTinh} · {new Date().getFullYear() - currentUser.namSinh} tuổi
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-rose-600">
                    Nhóm máu: {currentUser.nhomMau}
                  </span>
                  <span>•</span>
                  <span>{currentUser.soDienThoai}</span>
                </>
              ) : (
                <span>Chưa đăng nhập hồ sơ — Bạn có thể đăng nhập để lưu kết quả riêng biệt.</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserCheck className="w-4 h-4 text-teal-700" />
          <span>{currentUser ? 'Đổi hồ sơ khác' : 'Đăng nhập hồ sơ'}</span>
        </button>
      </div>

      {/* Card nổi bật hành động chính: Tải ảnh / Chụp phiếu */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="space-y-1 relative">
          <span className="text-xs font-bold tracking-wider uppercase text-[#0F766E]">
            Bắt đầu tác vụ
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Đọc và kiểm tra phiếu xét nghiệm của bạn
          </h2>
          <p className="text-sm text-[#475569]">
            Chọn ảnh đã chụp sẵn trong thư viện hoặc mở camera thiết bị để đối chiếu với bộ 10 chỉ số xét nghiệm phổ biến.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 relative">
          <Button
            variant="primary"
            size="lg"
            icon={<Camera className="w-5 h-5" />}
            onClick={() => navigate('/upload')}
            className="w-full justify-center text-base"
          >
            Chụp / Tải ảnh phiếu mới
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={<History className="w-5 h-5" />}
            onClick={() => navigate('/history')}
            className="w-full justify-center text-base"
          >
            Xem lịch sử đã lưu ({savedReports.length})
          </Button>
        </div>

        {/* Cam kết dữ liệu trung tính & an toàn */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-[#475569] leading-relaxed relative">
          <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
          <span>
            Ứng dụng KHÔNG cung cấp chẩn đoán y khoa hay kết luận bệnh. Toàn bộ thông tin được trình bày trung tính nhằm phục vụ mục đích đọc hiểu thông tin và chuẩn bị câu hỏi thảo luận với nhân viên y tế.
          </span>
        </div>
      </div>

      {/* BỘ CÔNG CỤ VÀ TIỆN ÍCH Y KHOA CHUYÊN NGHIỆP */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Tiện ích y khoa & Bách khoa tra cứu
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Các tính năng hỗ trợ mở rộng tham khảo từ các hệ thống theo dõi sức khỏe y tế chuyên nghiệp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Xu hướng */}
          <Link
            to="/trends"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                Biểu đồ xu hướng
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Theo dõi diễn tiến biến thiên của 10 chỉ số qua nhiều đợt xét nghiệm theo thời gian.
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-semibold text-teal-700 mt-2">
              <span>Mở biểu đồ</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Từ điển */}
          <Link
            to="/dictionary"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                Bách khoa 10 chỉ số
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tra cứu ý nghĩa, khoảng tham chiếu chuẩn Nam/Nữ và yếu tố sinh lý ảnh hưởng.
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-semibold text-teal-700 mt-2">
              <span>Tra cứu ngay</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Đổi đơn vị & BMI */}
          <Link
            to="/tools"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                Công cụ y khoa & BMI
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quy đổi đơn vị xét nghiệm (mmol/L ↔ mg/dL) và tính chỉ số thể trạng BMI.
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-semibold text-teal-700 mt-2">
              <span>Tính toán</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Cẩm nang chuẩn bị */}
          <Link
            to="/tools"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                Cẩm nang chuẩn bị
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Checklist tương tác các lưu ý nhịn ăn, uống nước, thuốc men trước khi lấy máu.
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-semibold text-teal-700 mt-2">
              <span>Xem checklist</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Luồng trải nghiệm 3 bước */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">
            Luồng tương tác 3 bước trực quan
          </h3>
          <span className="text-xs text-slate-500 font-medium">Quy chuẩn tương tác</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-[#0F172A]">Tải & Quét Phiếu</h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Tải ảnh phiếu giấy, hệ thống bảo mật không lưu ảnh gốc lên máy chủ để bảo vệ quyền riêng tư tuyệt đối.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-[#0F172A]">Đối chiếu 2 màn hình</h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Đặt ảnh gốc có thể phóng to bên cạnh danh sách số liệu, cho phép người dùng kiểm soát và chỉnh sửa mọi sai sót.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-[#0F172A]">Giải mã & Lưu trữ</h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              Trình bày trực quan bằng thước đo màu ngọc, phân loại 4 trạng thái trung tính và lưu trữ an toàn với Firestore.
            </p>
          </div>
        </div>
      </div>

      {/* Lối vào nhanh Lịch sử xét nghiệm gần đây nếu có */}
      {savedReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-left shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0F766E]" />
              <span>Phiếu gần nhất trong Firestore</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả ({savedReports.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => {
              navigate('/history');
            }}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold text-[#0F172A]">
                {savedReports[0].nhanPhieu}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">
                Ngày: {savedReports[0].ngayXetNghiem} · {savedReports[0].chiSo.length} chỉ số được theo dõi
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E]">
              <span>Mở xem</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* Ghi chú hướng phát triển tiếp theo */}
      <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-4 text-left text-xs text-[#475569] flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Hướng phát triển tiếp theo: </span>
          <span>
            Tính năng nhận diện quang học nâng cao từ camera, kết nối chuyên gia y tế và mở rộng danh mục xét nghiệm sinh hóa/miễn dịch chuyên sâu sẽ được nghiên cứu trong các phiên bản kế tiếp.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
