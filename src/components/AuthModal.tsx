import React, { useState } from 'react';
import {
  X,
  User,
  UserCheck,
  PlusCircle,
  Phone,
  Shield,
  Heart,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../data/labDictionary';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    profiles,
    switchProfile,
    loginUser,
    createProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'phone' | 'new'>('quick');

  // Phone login form
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // New profile form
  const [newHoTen, setNewHoTen] = useState('');
  const [newNamSinh, setNewNamSinh] = useState('1995');
  const [newGioiTinh, setNewGioiTinh] = useState<'Nam' | 'Nữ'>('Nam');
  const [newNhomMau, setNewNhomMau] = useState<UserProfile['nhomMau']>('O+');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại hoặc mã hồ sơ.');
      return;
    }
    const success = loginUser(phoneNumber);
    if (!success) {
      setPhoneError('Không tìm thấy tài khoản. Hãy tạo hồ sơ mới hoặc thử lại.');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoTen.trim()) {
      setFormError('Vui lòng nhập họ và tên bệnh nhân.');
      return;
    }
    createProfile({
      hoTen: newHoTen.trim(),
      namSinh: parseInt(newNamSinh) || 1995,
      gioiTinh: newGioiTinh,
      nhomMau: newNhomMau,
      soDienThoai: newPhone.trim() || '0900 000 000',
      ghiChuSucKhoe: newNotes.trim() || 'Hồ sơ sức khỏe cá nhân',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-7 shadow-2xl space-y-5 my-8 border border-slate-200 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hồ sơ Bệnh nhân & Tài khoản
              </h2>
              <p className="text-xs text-slate-500">
                Lưu trữ cục bộ an toàn trên thiết bị của bạn
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('quick');
              setPhoneError('');
              setFormError('');
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'quick'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đổi hồ sơ (1 chạm)
          </button>

          <button
            onClick={() => {
              setActiveTab('phone');
              setPhoneError('');
              setFormError('');
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'phone'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Số điện thoại
          </button>

          <button
            onClick={() => {
              setActiveTab('new');
              setPhoneError('');
              setFormError('');
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'new'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Tạo hồ sơ mới
          </button>
        </div>

        {/* TAB 1: QUICK PROFILE SWITCHER */}
        {activeTab === 'quick' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              Chọn hồ sơ bệnh nhân đang theo dõi để tự động gắn vào kết quả xét nghiệm và bản in:
            </div>

            {profiles.length === 0 ? (
              <div className="py-8 text-center space-y-3 bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Chưa có hồ sơ bệnh nhân nào trong cơ sở dữ liệu.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className="px-3 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#0D655E] transition-colors cursor-pointer"
                >
                  + Tạo hồ sơ mới ngay
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {profiles.map((profile) => {
                  const isActive = currentUser?.id === profile.id;
                  const age = new Date().getFullYear() - profile.namSinh;

                  return (
                    <div
                      key={profile.id}
                      onClick={() => switchProfile(profile.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs ${
                            profile.avatarColor || 'bg-teal-600'
                          }`}
                        >
                          {profile.hoTen
                            .split(' ')
                            .map((n) => n[0])
                            .slice(-2)
                            .join('')}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {profile.hoTen}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {profile.maHoSo}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>
                              {profile.gioiTinh}, {age} tuổi
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-rose-600">
                              Nhóm {profile.nhomMau}
                            </span>
                            <span>•</span>
                            <span>{profile.soDienThoai}</span>
                          </div>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="text-xs font-semibold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang chọn
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600">
                          Chọn
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PHONE / PATIENT ID LOGIN */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div className="text-xs text-slate-500">
              Nhập số điện thoại hoặc mã bệnh nhân (ví dụ: <code className="font-mono font-bold text-teal-700">0912 345 678</code> hoặc <code className="font-mono font-bold text-teal-700">BN-88421</code>):
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Số điện thoại hoặc Mã hồ sơ
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="0912 345 678 hoặc BN-88421"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white font-medium"
                />
              </div>
              {phoneError && (
                <p className="text-xs text-red-600 font-medium">{phoneError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F766E] hover:bg-[#0D655E] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Đăng nhập hồ sơ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: CREATE NEW PROFILE */}
        {activeTab === 'new' && (
          <form onSubmit={handleCreateProfile} className="space-y-3.5">
            {formError && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Họ và tên bệnh nhân *
              </label>
              <input
                type="text"
                value={newHoTen}
                onChange={(e) => setNewHoTen(e.target.value)}
                placeholder="Ví dụ: Lê Thị Hồng"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Năm sinh
                </label>
                <input
                  type="number"
                  value={newNamSinh}
                  onChange={(e) => setNewNamSinh(e.target.value)}
                  min="1920"
                  max="2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Giới tính
                </label>
                <select
                  value={newGioiTinh}
                  onChange={(e) => setNewGioiTinh(e.target.value as 'Nam' | 'Nữ')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Nhóm máu
                </label>
                <select
                  value={newNhomMau}
                  onChange={(e) => setNewNhomMau(e.target.value as UserProfile['nhomMau'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Số điện thoại liên hệ
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Ghi chú tình trạng sức khỏe / Tiền sử
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ví dụ: Dị ứng Penicillin, mỡ máu nhẹ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F766E] hover:bg-[#0D655E] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lưu và kích hoạt hồ sơ mới</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            Dữ liệu lưu trữ riêng tư tại trình duyệt
          </span>
          {currentUser && (
            <button
              onClick={() => {
                switchProfile(profiles[0].id);
                setIsAuthModalOpen(false);
              }}
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Đặt lại mặc định
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
