import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  FileText,
  History,
  TrendingUp,
  BookOpen,
  Calculator,
  User,
  ChevronDown,
  LogOut,
  UserCheck,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser, setIsAuthModalOpen, logoutUser } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const userInitials = currentUser?.hoTen
    ? currentUser.hoTen
        .split(' ')
        .map((n) => n[0])
        .slice(-2)
        .join('')
    : 'BN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 text-left group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0D655E] transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg text-[#0F172A] tracking-tight leading-none">
              MedDecode
            </div>
            <div className="text-[11px] text-[#475569] font-medium leading-tight mt-0.5 hidden sm:block">
              Hệ thống đọc hiểu kết quả xét nghiệm máu
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
          <Link
            to="/upload"
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              isActive('/upload') || isActive('/verify') || isActive('/dashboard')
                ? 'bg-teal-50 text-[#0F766E] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Đọc phiếu</span>
          </Link>

          <Link
            to="/trends"
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              isActive('/trends')
                ? 'bg-teal-50 text-[#0F766E] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Xu hướng</span>
          </Link>

          <Link
            to="/history"
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              isActive('/history') || isActive('/compare')
                ? 'bg-teal-50 text-[#0F766E] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch sử</span>
          </Link>

          <Link
            to="/dictionary"
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              isActive('/dictionary')
                ? 'bg-teal-50 text-[#0F766E] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Bách khoa 10 chỉ số</span>
            <span className="md:hidden">Tra cứu</span>
          </Link>

          <Link
            to="/tools"
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              isActive('/tools')
                ? 'bg-teal-50 text-[#0F766E] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Công cụ y khoa</span>
            <span className="sm:hidden">Công cụ</span>
          </Link>
        </nav>

        {/* Nút Hồ sơ Bệnh nhân / Đăng nhập Local */}
        <div className="relative shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-slate-50 transition-all cursor-pointer text-left shadow-2xs"
                title="Hồ sơ bệnh nhân hiện tại"
              >
                <div
                  className={`w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-2xs ${
                    currentUser.avatarColor || 'bg-teal-600'
                  }`}
                >
                  {userInitials}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.hoTen}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-tight">
                    {currentUser.maHoSo}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 space-y-3 animate-in fade-in zoom-in-95 text-left">
                    {/* Thông tin hồ sơ */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {currentUser.hoTen}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                          Nhóm {currentUser.nhomMau}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {currentUser.gioiTinh} · {new Date().getFullYear() - currentUser.namSinh} tuổi
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Mã BN: {currentUser.maHoSo}
                      </div>
                    </div>

                    {/* Thao tác */}
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-teal-700" />
                        <span>Đổi hồ sơ bệnh nhân khác</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Chuyển sang chế độ khách</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập hồ sơ</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal đăng nhập / đổi hồ sơ */}
      <AuthModal />
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-[#475569] text-center no-print">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 font-medium">
          <span>MedDecode Healthcare Systems</span>
          <span aria-hidden="true">·</span>
          <span>Google Cloud Firestore</span>
          <span aria-hidden="true">·</span>
          <span>Calm Medical Interface</span>
          <span aria-hidden="true">·</span>
          <span>Longitudinal Health Records</span>
        </div>
        <p className="text-slate-400 max-w-xl mx-auto text-[11px]">
          Hệ thống được thiết kế theo nguyên tắc dữ liệu y tế trung tính: không phán đoán nguy hiểm, không kết luận bệnh.
        </p>
      </div>
    </footer>
  );
};
