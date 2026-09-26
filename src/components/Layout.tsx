import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  FileText,
  History,
  TrendingUp,
  Users,
  GitCompare,
  LogOut,
  UserCheck,
  Plus,
  Menu,
  X,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
  requiresPatient: boolean;
  activeMatches: (pathname: string) => boolean;
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logoutUser, setIsAuthModalOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItemConfig[] = [
    {
      path: '/',
      label: 'Hồ sơ bệnh nhân',
      icon: <Users className="w-5 h-5" />,
      requiresPatient: false,
      activeMatches: (pathname) => pathname === '/',
    },
    {
      path: '/upload',
      label: 'Đọc phiếu xét nghiệm',
      icon: <FileText className="w-5 h-5" />,
      requiresPatient: true,
      activeMatches: (pathname) =>
        pathname === '/upload' ||
        pathname === '/verify' ||
        pathname === '/dashboard' ||
        pathname.startsWith('/indicator'),
    },
    {
      path: '/history',
      label: 'Lịch sử xét nghiệm',
      icon: <History className="w-5 h-5" />,
      requiresPatient: true,
      activeMatches: (pathname) => pathname === '/history',
    },
    {
      path: '/compare',
      label: 'So sánh kết quả',
      icon: <GitCompare className="w-5 h-5" />,
      requiresPatient: true,
      activeMatches: (pathname) => pathname === '/compare',
    },
    {
      path: '/trends',
      label: 'Xu hướng biến thiên',
      icon: <TrendingUp className="w-5 h-5" />,
      requiresPatient: true,
      activeMatches: (pathname) => pathname === '/trends',
    },
  ];

  const userInitials = currentUser?.hoTen
    ? currentUser.hoTen
        .split(' ')
        .map((n) => n[0])
        .slice(-2)
        .join('')
    : 'BN';

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (item: NavItemConfig, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (item.requiresPatient && !currentUser) {
      e.preventDefault();
      navigate('/');
    }
  };

  // Nội dung sidebar chung dùng cho cả Desktop và Mobile Drawer
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-[#0F172A] select-none">
      {/* 1. Header Logo & Brand */}
      <div className="p-5 border-b border-slate-200">
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0D655E] transition-all shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
              MedDecode
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1 truncate">
              Quản lý xét nghiệm máu
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Thẻ thông tin bệnh nhân đang chọn */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        {currentUser ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 ${
                  currentUser.avatarColor || 'bg-teal-600'
                }`}
              >
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider leading-none">
                  Đang xem hồ sơ
                </div>
                <div className="font-bold text-sm text-slate-900 truncate mt-1 leading-snug">
                  {currentUser.hoTen}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-mono font-medium text-slate-600">{currentUser.maHoSo}</span>
                  <span>·</span>
                  <span>Nhóm {currentUser.nhomMau}</span>
                </div>
              </div>
            </div>

            {/* Thao tác nhanh với hồ sơ */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Chọn hồ sơ khác"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Đổi hồ sơ</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 text-xs transition-colors cursor-pointer shadow-2xs"
                title="Đóng hồ sơ hiện tại"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-white rounded-xl border border-dashed border-teal-300 text-center space-y-2 shadow-2xs">
            <div className="text-xs text-slate-600 font-medium">
              Chưa chọn hồ sơ bệnh nhân
            </div>
            <button
              type="button"
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chọn hồ sơ</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Danh sách điều hướng chức năng bên trái */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          Mục chức năng
        </div>

        {navItems.map((item) => {
          const active = item.activeMatches(location.pathname);
          const isLocked = item.requiresPatient && !currentUser;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(item, e)}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-teal-50 text-[#0F766E] font-bold shadow-2xs border border-teal-200/80'
                  : isLocked
                  ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`${
                    active
                      ? 'text-[#0F766E]'
                      : isLocked
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {isLocked && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal shrink-0">
                  Cần chọn BN
                </span>
              )}

              {active && !isLocked && (
                <span className="w-1.5 h-4 bg-[#0F766E] rounded-full shrink-0" />
              )}
            </Link>
          );
        })}

        {/* Nút hành động nổi bật khi đã có bệnh nhân */}
        {currentUser && (
          <div className="pt-4 px-1">
            <Link
              to="/upload"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tải phiếu xét nghiệm</span>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Footer của sidebar: Trạng thái hệ thống */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">Cloud Firestore • Trực tuyến</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
          <span>Dữ liệu y tế an toàn, trung tính</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] font-['Be_Vietnam_Pro',sans-serif]">
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR: Cố định bên trái màn hình (w-64) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 border-r border-slate-200 bg-white z-30 no-print shadow-xs">
        {renderSidebarContent()}
      </aside>

      {/* ======================================================== */}
      {/* MOBILE DRAWER: Cho màn hình nhỏ (< md) */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print">
          {/* Overlay nền mờ */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer trượt ra từ bên trái */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA: Chứa nội dung trang & Footer */}
      {/* Trên desktop có ml-64 để tránh bị sidebar che khuất */}
      {/* ======================================================== */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Top bar trên Mobile */}
        <header className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Mở menu chức năng"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                MedDecode
              </span>
            </Link>
          </div>

          {/* Hồ sơ nhỏ trên mobile bar */}
          <div>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800"
              >
                <div
                  className={`w-5 h-5 rounded-md text-white font-bold flex items-center justify-center text-[10px] ${
                    currentUser.avatarColor || 'bg-teal-600'
                  }`}
                >
                  {userInitials}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.hoTen}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
              >
                Chọn BN
              </button>
            )}
          </div>
        </header>

        {/* Nội dung màn hình chính */}
        <main className="flex-1 pb-10">
          {children}
        </main>

        {/* Footer ở cuối trang */}
        <Footer />
      </div>

      {/* Modal đăng ký / chuyển đổi hồ sơ */}
      <AuthModal />
    </div>
  );
};

// Giữ lại Header và Footer để tương thích ngược nếu cần
export const Header: React.FC = () => null;

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-[#475569] text-center no-print">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 font-medium">
          <span className="font-semibold text-slate-700">MedDecode</span>
          <span aria-hidden="true">·</span>
          <span>Google Cloud Firestore</span>
          <span aria-hidden="true">·</span>
          <span>Hệ thống Quản lý Hồ sơ & Kết quả Xét nghiệm Máu</span>
        </div>
        <p className="text-slate-400 max-w-xl mx-auto text-[11px]">
          Dữ liệu y tế trung tính: không phán đoán nguy hiểm, không kết luận bệnh tật. Hỗ trợ người dùng kiểm tra và theo dõi chỉ số khoa học.
        </p>
      </div>
    </footer>
  );
};

export default AppLayout;
