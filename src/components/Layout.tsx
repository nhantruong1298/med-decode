import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, FileText, History, Info } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-left group">
          <div className="w-9 h-9 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0D655E] transition-colors">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg text-[#0F172A] tracking-tight leading-none">
              MedDecode
            </div>
            <div className="text-[11px] text-[#475569] font-medium leading-tight">
              Đọc hiểu kết quả xét nghiệm máu
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/upload"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/upload') || isActive('/verify') || isActive('/dashboard')
                ? 'bg-teal-50 text-[#0F766E]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Phiếu xét nghiệm</span>
          </Link>

          <Link
            to="/history"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/history') || isActive('/compare')
                ? 'bg-teal-50 text-[#0F766E]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch sử</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-[#475569] text-center">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="font-semibold text-slate-700">
          MedDecode — Đồ án học thuật UI/UX Hỗ trợ Đọc hiểu Kết quả Xét nghiệm Máu
        </p>
        <p className="text-slate-500 max-w-xl mx-auto">
          Ứng dụng thiết kế theo nguyên tắc UX dữ liệu y tế trung tính. Lưu trữ dữ liệu với Google Cloud Firestore. Không đưa ra bất kỳ kết luận chẩn đoán bệnh nào.
        </p>
      </div>
    </footer>
  );
};
