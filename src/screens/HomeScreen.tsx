import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Upload,
  History,
  TrendingUp,
  FileText,
  Calendar,
  Phone,
  X,
  Eye,
  Trash2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { UserProfile, SavedReport } from '../data/labDictionary';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    profiles,
    currentUser,
    switchProfile,
    createProfile,
    deleteProfile,
    logoutUser,
    savedReports,
    setCurrentReport,
    setIsDirty,
    isLoadingProfiles,
  } = useApp();

  // State tìm kiếm & bộ lọc
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'Nam' | 'Nữ'>('ALL');

  // Modal tạo hồ sơ mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newHoTen, setNewHoTen] = useState('');
  const [newNamSinh, setNewNamSinh] = useState('1994');
  const [newGioiTinh, setNewGioiTinh] = useState<'Nam' | 'Nữ'>('Nam');
  const [newNhomMau, setNewNhomMau] = useState<UserProfile['nhomMau']>('O+');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [createError, setCreateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hồ sơ đang chọn để xem chi tiết (chỉ có khi đã chọn currentUser)
  const selectedPatient = currentUser ?? null;

  // Chọn hồ sơ bệnh nhân
  const handleSelectProfile = (profile: UserProfile) => {
    switchProfile(profile.id);
  };

  // Đếm số lượng phiếu xét nghiệm theo từng bệnh nhân
  const patientReportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const latestDates: Record<string, string> = {};

    savedReports.forEach((report) => {
      const matchedProfile = profiles.find(
        (p) =>
          (report.patientId && p.id === report.patientId) ||
          (report.patientName && p.hoTen.toLowerCase() === report.patientName.toLowerCase())
      );

      if (matchedProfile) {
        counts[matchedProfile.id] = (counts[matchedProfile.id] || 0) + 1;
        if (
          !latestDates[matchedProfile.id] ||
          new Date(report.ngayXetNghiem) > new Date(latestDates[matchedProfile.id])
        ) {
          latestDates[matchedProfile.id] = report.ngayXetNghiem;
        }
      }
    });

    return { counts, latestDates };
  }, [savedReports, profiles]);

  // Lọc danh sách hồ sơ theo tìm kiếm & bộ lọc
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.hoTen.toLowerCase().includes(q) ||
        p.soDienThoai.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        p.maHoSo.toLowerCase().includes(q) ||
        p.nhomMau.toLowerCase().includes(q) ||
        String(p.namSinh).includes(q);

      if (!matchSearch) return false;

      if (genderFilter === 'Nam' && p.gioiTinh !== 'Nam') return false;
      if (genderFilter === 'Nữ' && p.gioiTinh !== 'Nữ') return false;

      return true;
    });
  }, [profiles, searchQuery, genderFilter]);

  // Đếm số lượng hồ sơ theo giới tính để hiển thị lên các nút bộ lọc
  const filterCounts = useMemo(() => {
    let nam = 0;
    let nu = 0;
    profiles.forEach((p) => {
      if (p.gioiTinh === 'Nam') nam += 1;
      if (p.gioiTinh === 'Nữ') nu += 1;
    });
    return { nam, nu };
  }, [profiles]);

  // Xử lý tạo hồ sơ mới thật lưu vào Firestore
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newHoTen.trim()) {
      setCreateError('Vui lòng nhập họ và tên bệnh nhân.');
      return;
    }

    const birthYear = parseInt(newNamSinh, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      setCreateError(`Năm sinh không hợp lệ (từ 1900 đến ${currentYear}).`);
      return;
    }

    if (!newPhone.trim()) {
      setCreateError('Vui lòng nhập số điện thoại liên hệ.');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createProfile({
        hoTen: newHoTen.trim(),
        namSinh: birthYear,
        gioiTinh: newGioiTinh,
        nhomMau: newNhomMau,
        soDienThoai: newPhone.trim(),
        ghiChuSucKhoe: newNotes.trim() || '',
      });

      // Reset form & đóng modal
      setNewHoTen('');
      setNewPhone('');
      setNewNotes('');
      setIsCreateModalOpen(false);

      // Tự động chọn và xem chi tiết của bệnh nhân vừa tạo
      switchProfile(created.id);
    } catch (err: any) {
      setCreateError(err?.message || 'Không thể tạo hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa hồ sơ với xác nhận
  const handleDeleteProfile = async (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa hồ sơ của bệnh nhân "${profile.hoTen}" khỏi cơ sở dữ liệu?`
    );
    if (confirmed) {
      await deleteProfile(profile.id);
      if (currentUser?.id === profile.id) {
        logoutUser();
      }
    }
  };

  // Mở chi tiết hồ sơ bệnh nhân
  const handleOpenDetail = (profile: UserProfile) => {
    handleSelectProfile(profile);
  };

  // Nhanh: Chọn ảnh xét nghiệm cho bệnh nhân
  const handleGoToUpload = (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    switchProfile(profile.id);
    navigate('/upload');
  };

  // Nhanh: Xem lịch sử xét nghiệm của bệnh nhân
  const handleGoToHistory = (profile: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    switchProfile(profile.id);
    navigate('/history');
  };

  // Xem chi tiết một phiếu trong Dashboard
  const handleViewReport = (report: SavedReport) => {
    setCurrentReport({
      ngayXetNghiem: report.ngayXetNghiem,
      nhanPhieu: report.nhanPhieu,
      chiSo: [...report.chiSo],
    });
    setIsDirty(false);
    navigate('/dashboard');
  };

  // Lấy danh sách phiếu của bệnh nhân đang chọn xem chi tiết
  const currentPatientReports = useMemo(() => {
    if (!selectedPatient) return [];
    return savedReports.filter(
      (r) =>
        (r.patientId && r.patientId === selectedPatient.id) ||
        (r.patientName && r.patientName.toLowerCase() === selectedPatient.hoTen.toLowerCase())
    );
  }, [savedReports, selectedPatient]);

  // ==========================================
  // VIEW 2: MÀN HÌNH CHI TIẾT HỒ SƠ BỆNH NHÂN
  // ==========================================
  if (selectedPatient) {
    const age = new Date().getFullYear() - selectedPatient.namSinh;
    const reportCount = currentPatientReports.length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Khối thông tin chi tiết hồ sơ bệnh nhân */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl text-white font-extrabold flex items-center justify-center text-xl shadow-xs shrink-0 ${
                  selectedPatient.avatarColor || 'bg-teal-600'
                }`}
              >
                {selectedPatient.hoTen
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {selectedPatient.hoTen}
                  </h1>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
                    {selectedPatient.maHoSo}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                  <span className="font-medium">
                    {selectedPatient.gioiTinh} · {age} tuổi ({selectedPatient.namSinh})
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                    Nhóm máu: {selectedPatient.nhomMau}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedPatient.soDienThoai}
                  </span>
                </div>

                {selectedPatient.ghiChuSucKhoe && (
                  <p className="text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Lưu ý sức khỏe: </span>
                    {selectedPatient.ghiChuSucKhoe}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => handleDeleteProfile(selectedPatient)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors border border-red-200 cursor-pointer"
                title="Xóa hồ sơ khỏi cơ sở dữ liệu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* HAI HÀNH ĐỘNG TRỌNG TÂM: CHỌN ẢNH XÉT NGHIỆM VÀ XEM LỊCH SỬ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
          {/* HÀNH ĐỘNG 1: TẢI & CHỌN ẢNH XÉT NGHIỆM */}
          <div className="bg-gradient-to-br from-white to-teal-50/40 rounded-2xl border-2 border-teal-200 shadow-sm p-6 space-y-4 hover:border-teal-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Xét nghiệm mới
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Chọn ảnh xét nghiệm
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tải tệp ảnh phiếu xét nghiệm máu từ máy tính hoặc điện thoại. AI sẽ tự động đọc ngày xét nghiệm và bóc tách các chỉ số y khoa để đối chiếu.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => navigate('/upload')}
              className="w-full justify-center text-base py-3 shadow-md shadow-teal-900/10"
            >
              Chọn ảnh & Quét bằng AI
            </Button>
          </div>

          {/* HÀNH ĐỘNG 2: XEM LỊCH SỬ XÉT NGHIỆM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-xs border border-slate-200">
                <History className="w-6 h-6 text-[#0F766E]" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Dữ liệu đã lưu
                  </span>
                  <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {reportCount} phiếu
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Xem lịch sử xét nghiệm
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Theo dõi diễn tiến qua các đợt khám, so sánh kết quả giữa 2 phiếu và xuất bản in tóm tắt y khoa dành riêng cho bệnh nhân này.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              icon={<History className="w-5 h-5" />}
              onClick={() => navigate('/history')}
              className="w-full justify-center text-base py-3"
            >
              Mở lịch sử ({reportCount} phiếu)
            </Button>
          </div>
        </div>

        {/* DANH SÁCH PHIẾU XÉT NGHIỆM GẦN ĐÂY CỦA BỆNH NHÂN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-left shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F766E]" />
              <h3 className="font-bold text-slate-900">
                Các phiếu xét nghiệm gần đây của {selectedPatient.hoTen}
              </h3>
            </div>
            {reportCount > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
              >
                Xem tất cả ({reportCount})
              </button>
            )}
          </div>

          {currentPatientReports.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Chưa có phiếu xét nghiệm nào được lưu cho bệnh nhân này
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hãy chọn một tệp ảnh phiếu xét nghiệm để thực hiện lần kiểm tra đầu tiên.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => navigate('/upload')}
              >
                Chọn ảnh xét nghiệm ngay
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {currentPatientReports.slice(0, 4).map((report) => (
                <div
                  key={report.id || report.ngayXetNghiem}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {report.nhanPhieu}
                      </span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {report.ngayXetNghiem}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Đã ghi nhận {report.chiSo.length} chỉ số huyết học & sinh hóa
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => handleViewReport(report)}
                      className="text-xs"
                    >
                      Xem kết quả
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DANH SÁCH HỒ SƠ BỆNH NHÂN (TRANG CHỦ MẶC ĐỊNH)
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">
      {/* Tiêu đề & Giới thiệu */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Hồ Sơ Bệnh Nhân & Quản Lý Kết Quả Xét Nghiệm</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Danh sách hồ sơ bệnh nhân
            </h1>
            <p className="text-sm text-[#475569] mt-1">
              Dữ liệu được lưu trữ trên Cloud Firestore. Chọn một hồ sơ để bắt đầu đọc phiếu xét nghiệm hoặc tạo mới nếu chưa có.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setCreateError('');
              setIsCreateModalOpen(true);
            }}
            className="shrink-0 shadow-sm"
          >
            Tạo hồ sơ mới
          </Button>
        </div>
      </div>


      {/* ĐANG TẢI DỮ LIỆU TỪ FIRESTORE */}
      {isLoadingProfiles && profiles.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">
            Đang tải dữ liệu hồ sơ từ cơ sở dữ liệu Firestore...
          </p>
        </div>
      )}

      {/* TRƯỜNG HỢP 1: HOÀN TOÀN CHƯA CÓ HỒ SƠ NÀO TRONG DATABASE */}
      {!isLoadingProfiles && profiles.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F766E] mx-auto flex items-center justify-center border border-teal-200 shadow-xs">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Chưa có hồ sơ bệnh nhân nào trong cơ sở dữ liệu
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hệ thống không sử dụng dữ liệu mẫu giả lập. Hãy bấm nút bên dưới để tạo hồ sơ bệnh nhân thật đầu tiên của bạn.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => {
                setCreateError('');
                setIsCreateModalOpen(true);
              }}
              className="shadow-md shadow-teal-900/10 text-base py-3"
            >
              Tạo hồ sơ bệnh nhân đầu tiên
            </Button>
          </div>
        </div>
      )}

      {/* TRƯỜNG HỢP 2: ĐÃ CÓ HỒ SƠ TRONG DATABASE */}
      {profiles.length > 0 && (
        <>
          {/* THANH CÔNG CỤ: TÌM KIẾM & BỘ LỌC */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-left">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Ô tìm kiếm */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, năm sinh, số điện thoại, mã hồ sơ (VD: BN-88421)..."
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bộ lọc: 2 nhóm tách biệt - Giới tính (chọn 1) và Trạng thái (bật/tắt) */}
              <div className="flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
                {/* Nhóm 1: Giới tính - dạng segmented control, chỉ chọn 1 giá trị */}
                <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-0.5 shrink-0">
                  {(
                    [
                      { key: 'ALL' as const, label: 'Tất cả', count: profiles.length },
                      { key: 'Nam' as const, label: 'Nam', count: filterCounts.nam },
                      { key: 'Nữ' as const, label: 'Nữ', count: filterCounts.nu },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setGenderFilter(opt.key)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                        genderFilter === opt.key
                          ? 'bg-white text-teal-700 shadow-xs'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Thống kê kết quả tìm kiếm */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Hiển thị <strong>{filteredProfiles.length}</strong> / {profiles.length} hồ sơ bệnh nhân
              </span>
              {currentUser && (
                <span className="text-[11px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Đang chọn: {currentUser.hoTen} ({currentUser.maHoSo})
                </span>
              )}
            </div>
          </div>

          {/* DANH SÁCH THẺ HỒ SƠ */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Không tìm thấy hồ sơ bệnh nhân phù hợp
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Không có hồ sơ nào khớp với từ khóa "{searchQuery}".
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setGenderFilter('ALL');
                  }}
                >
                  Xóa bộ lọc
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Tạo hồ sơ mới ngay
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {filteredProfiles.map((profile) => {
                const age = new Date().getFullYear() - profile.namSinh;
                const reportsCount = patientReportCounts.counts[profile.id] || 0;
                const latestDate = patientReportCounts.latestDates[profile.id];
                const isCurrentActive = currentUser?.id === profile.id;

                return (
                  <div
                    key={profile.id}
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 hover:shadow-md cursor-pointer ${
                      isCurrentActive
                        ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleOpenDetail(profile)}
                  >
                    {/* Phần trên: Avatar + Tên + Mã */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0 ${
                              profile.avatarColor || 'bg-teal-600'
                            }`}
                          >
                            {profile.hoTen
                              .split(' ')
                              .map((n) => n[0])
                              .slice(-2)
                              .join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {profile.hoTen}
                              </h3>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 mt-1 inline-block">
                              {profile.maHoSo}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteProfile(profile, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa hồ sơ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Thông tin nhân khẩu */}
                      <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Giới tính & Tuổi:</span>
                          <span className="font-semibold text-slate-800">
                            {profile.gioiTinh} · {age} tuổi ({profile.namSinh})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Nhóm máu:</span>
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                            {profile.nhomMau}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Số điện thoại:</span>
                          <span className="font-mono text-slate-800">{profile.soDienThoai}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Phiếu xét nghiệm:</span>
                          <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                            {reportsCount} phiếu
                            {latestDate ? ` (gần nhất ${latestDate})` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Ghi chú sức khỏe */}
                      {profile.ghiChuSucKhoe && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {profile.ghiChuSucKhoe}
                        </p>
                      )}
                    </div>

                    {/* Phần dưới: Các nút bấm thao tác */}
                    <div
                      className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenDetail(profile)}
                        className="flex-1 justify-center text-xs"
                      >
                        Vào chi tiết hồ sơ
                      </Button>

                      <button
                        onClick={(e) => handleGoToUpload(profile, e)}
                        className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors border border-teal-200 cursor-pointer"
                        title="Chọn ảnh xét nghiệm ngay cho hồ sơ này"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleGoToHistory(profile, e)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
                        title="Xem lịch sử xét nghiệm của hồ sơ này"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODAL TẠO HỒ SƠ BỆNH NHÂN MỚI (LƯU VÀO FIRESTORE) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 border border-slate-200 text-left animate-in fade-in">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tạo hồ sơ bệnh nhân mới
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hồ sơ thật sẽ được lưu trữ trực tiếp vào cơ sở dữ liệu Cloud Firestore
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Báo lỗi nếu thiếu */}
            {createError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {createError}
              </div>
            )}

            {/* Biểu mẫu nhập liệu */}
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên bệnh nhân <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder="Ví dụ: Nguyễn Thị Hoa"
                  value={newHoTen}
                  onChange={(e) => setNewHoTen(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={newNamSinh}
                    onChange={(e) => setNewNamSinh(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giới tính sinh học <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newGioiTinh}
                    onChange={(e) => setNewGioiTinh(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhóm máu
                  </label>
                  <select
                    value={newNhomMau}
                    onChange={(e) => setNewNhomMau(e.target.value as UserProfile['nhomMau'])}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white font-mono"
                  >
                    <option value="O+">O+ (Phổ biến)</option>
                    <option value="O-">O- (Hiếm)</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0912 345 678"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiền sử bệnh lý / Lưu ý sức khỏe (nếu có)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Tiền sử dị ứng thuốc, cần theo dõi đường huyết hoặc mỡ máu..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              {/* Nút hành động */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu vào Firestore...' : 'Lưu hồ sơ vào Database'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
