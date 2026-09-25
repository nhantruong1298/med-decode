import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Filter,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Activity,
  Heart,
  Droplets,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { THU_VIEN_CHI_SO, DANH_SACH_MA_CHI_SO, ChiSoDefinition } from '../data/labDictionary';

export const DictionaryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Tất cả');

  const groups = ['Tất cả', 'Huyết học', 'Đường huyết & Chuyển hóa', 'Chức năng Thận', 'Chức năng Gan'];

  const filteredIndicators = useMemo(() => {
    return DANH_SACH_MA_CHI_SO.map((code) => THU_VIEN_CHI_SO[code]).filter((def) => {
      if (!def) return false;
      const matchesGroup = selectedGroup === 'Tất cả' || def.nhom === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        def.ma.toLowerCase().includes(q) ||
        def.tenDayDu.toLowerCase().includes(q) ||
        def.giaiThich.toLowerCase().includes(q) ||
        def.coQuan.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [searchQuery, selectedGroup]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Tiêu đề & Giới thiệu */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#0F766E]" />
          Bách Khoa Tra Cứu 10 Chỉ Số Xét Nghiệm Máu
        </h1>
        <p className="text-sm text-[#475569]">
          Thư viện kiến thức đối chiếu y khoa trung tính, giúp người dùng hiểu rõ ý nghĩa sinh lý, khoảng tham chiếu theo nhân khẩu học và các yếu tố ảnh hưởng.
        </p>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc nhóm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Input tìm kiếm */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã (GLU, WBC, AST...), tên tiếng Việt hoặc cơ quan..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Nhóm phân loại */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {groups.map((group) => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Danh sách thẻ chỉ số */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500">
          Hiển thị {filteredIndicators.length} chỉ số phù hợp
        </div>

        {filteredIndicators.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm space-y-2">
            <p>Không tìm thấy chỉ số nào khớp với từ khóa "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('Tất cả');
              }}
              className="text-xs font-semibold text-teal-700 underline cursor-pointer"
            >
              Xóa bộ lọc để xem toàn bộ
            </button>
          </div>
        ) : (
          filteredIndicators.map((def) => {
            return (
              <div
                key={def.ma}
                className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs hover:border-teal-200 transition-all space-y-4"
              >
                {/* Header card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0F766E] font-bold text-base">
                      {def.ma}
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                        {def.tenDayDu}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          {def.nhom}
                        </span>
                        <span>•</span>
                        <span>{def.coQuan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">Khoảng chuẩn tham chiếu:</span>
                    <span className="text-sm font-bold text-[#0F766E] font-mono">
                      {def.khoangThamChieuText}
                    </span>
                  </div>
                </div>

                {/* Ý nghĩa và cách đọc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-teal-600" />
                      Ý nghĩa sinh học trong máu:
                    </span>
                    <p className="leading-relaxed">{def.giaiThich}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      Cách tiếp cận và đọc kết quả:
                    </span>
                    <p className="leading-relaxed">{def.cachDoc}</p>
                  </div>
                </div>

                {/* Khoảng tham chiếu theo Giới tính (Nam vs Nữ) */}
                <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-100 text-xs">
                  <span className="font-semibold text-teal-900 block mb-2">
                    Khoảng tham chiếu chi tiết theo giới tính:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div className="bg-white p-2 rounded-lg border border-teal-100 flex items-center justify-between">
                      <span className="font-medium text-slate-600">Nam giới trưởng thành:</span>
                      <span className="font-bold text-teal-800 font-mono">{def.thamChieuNam.text}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-teal-100 flex items-center justify-between">
                      <span className="font-medium text-slate-600">Nữ giới trưởng thành:</span>
                      <span className="font-bold text-teal-800 font-mono">{def.thamChieuNu.text}</span>
                    </div>
                  </div>
                </div>

                {/* Yếu tố sinh lý ảnh hưởng */}
                {def.yeuToSinhLy && def.yeuToSinhLy.length > 0 && (
                  <div className="text-xs space-y-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      Yếu tố sinh lý thông thường có thể làm thay đổi chỉ số:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                      {def.yeuToSinhLy.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer card actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <Link
                    to={`/indicator/${def.ma}`}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                  >
                    <span>Xem trang chi tiết đầy đủ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/trends"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Xem biểu đồ xu hướng</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DictionaryScreen;
