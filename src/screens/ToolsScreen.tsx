import React, { useState } from 'react';
import {
  Calculator,
  ClipboardCheck,
  ArrowRightLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Scale,
  Heart,
  Droplets,
} from 'lucide-react';
import {
  DANH_SACH_BO_CHUYEN_DOI,
  CAM_NANG_CHUAN_BI,
  UnitConverterItem,
  PreTestGuideItem,
  tinhChiSoBMI,
} from '../data/labDictionary';
import { useApp } from '../context/AppContext';

export const ToolsScreen: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'converter' | 'prep' | 'bmi'>('converter');

  // State cho Tab Chuyển đổi đơn vị
  const [selectedPresetId, setSelectedPresetId] = useState<string>('conv-glu');
  const activePreset =
    DANH_SACH_BO_CHUYEN_DOI.find((p) => p.id === selectedPresetId) || DANH_SACH_BO_CHUYEN_DOI[0];

  const [inputValA, setInputValA] = useState<string>(String(activePreset.giaTriMauA));
  const [inputValB, setInputValB] = useState<string>(
    String(Number((activePreset.giaTriMauA * activePreset.heSoChuyenDoiA_sang_B).toFixed(2)))
  );

  const handlePresetChange = (preset: UnitConverterItem) => {
    setSelectedPresetId(preset.id);
    setInputValA(String(preset.giaTriMauA));
    setInputValB(
      String(Number((preset.giaTriMauA * preset.heSoChuyenDoiA_sang_B).toFixed(2)))
    );
  };

  const handleValAChange = (valStr: string) => {
    setInputValA(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      const converted = num * activePreset.heSoChuyenDoiA_sang_B;
      setInputValB(String(Number(converted.toFixed(2))));
    } else {
      setInputValB('');
    }
  };

  const handleValBChange = (valStr: string) => {
    setInputValB(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && activePreset.heSoChuyenDoiA_sang_B > 0) {
      const converted = num / activePreset.heSoChuyenDoiA_sang_B;
      setInputValA(String(Number(converted.toFixed(2))));
    } else {
      setInputValA('');
    }
  };

  // State cho Tab Cẩm nang chuẩn bị
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'prep-fasting': true,
    'prep-water': true,
    'prep-alcohol': true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = CAM_NANG_CHUAN_BI.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / CAM_NANG_CHUAN_BI.length) * 100);

  // State cho Tab Tính BMI & Nguy cơ chuyển hóa
  const [heightCm, setHeightCm] = useState<string>('170');
  const [weightKg, setWeightKg] = useState<string>('65');

  const bmiResult = tinhChiSoBMI(parseFloat(heightCm) || 0, parseFloat(weightKg) || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Tiêu đề */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#0F766E]" />
          Công Cụ Y Khoa Hữu Ích
        </h1>
        <p className="text-sm text-[#475569]">
          Hỗ trợ quy đổi đơn vị đo giữa các phòng xét nghiệm, đánh giá thể trạng BMI và chuẩn bị đúng quy cách trước khi lấy mẫu máu.
        </p>
      </div>

      {/* Tabs chuyển đổi chức năng */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('converter')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'converter'
              ? 'border-[#0F766E] text-[#0F766E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Đổi đơn vị xét nghiệm</span>
        </button>

        <button
          onClick={() => setActiveTab('bmi')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bmi'
              ? 'border-[#0F766E] text-[#0F766E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Tính chỉ số thể trạng BMI</span>
        </button>

        <button
          onClick={() => setActiveTab('prep')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'prep'
              ? 'border-[#0F766E] text-[#0F766E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Cẩm nang trước khi lấy máu</span>
          <span className="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-teal-50 text-teal-800 font-bold">
            {progressPercent}%
          </span>
        </button>
      </div>

      {/* NỘI DUNG TAB 1: CHUYỂN ĐỔI ĐƠN VỊ */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          {/* Bộ chọn chỉ số cần đổi */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Chọn loại chỉ số xét nghiệm:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DANH_SACH_BO_CHUYEN_DOI.map((preset) => {
                const isSelected = preset.id === activePreset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.ma}</div>
                    <div className="text-[11px] truncate text-slate-500 mt-0.5">
                      {preset.tenChiSo.split('(')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Khung máy tính quy đổi 2 chiều */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {activePreset.tenChiSo} ({activePreset.ma})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Công thức quy đổi y khoa:{' '}
                <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono font-bold">
                  {activePreset.congThucText}
                </code>
              </p>
            </div>

            {/* Hai cột nhập giá trị tương tác */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Đơn vị A */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Đơn vị A (Chuẩn Việt Nam):</span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-teal-100 text-teal-800">
                    {activePreset.donViA}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={inputValA}
                    onChange={(e) => handleValAChange(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xl font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {activePreset.donViA}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Khoảng tham chiếu chuẩn: <strong>{activePreset.khoangChuanA}</strong>
                </div>
              </div>

              {/* Đơn vị B */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Đơn vị B (Quốc tế / Máy gia đình):</span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-sky-100 text-sky-800">
                    {activePreset.donViB}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={inputValB}
                    onChange={(e) => handleValBChange(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xl font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {activePreset.donViB}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Khoảng tham chiếu chuẩn: <strong>{activePreset.khoangChuanB}</strong>
                </div>
              </div>
            </div>

            {/* Ghi chú thực tế */}
            <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-teal-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" />
                Thực tế tại các phòng xét nghiệm:
              </span>
              <p>{activePreset.ghiChu}</p>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 2: TÍNH CHỈ SỐ THỂ TRẠNG BMI */}
      {activeTab === 'bmi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-700" />
                <span>Đánh giá Thể trạng BMI & Nguy cơ Chuyển hóa</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ số khối cơ thể (BMI) theo thang phân loại chuẩn của Tổ chức Y tế Thế giới (WHO) dành cho người châu Á.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block">
                  Chiều cao (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    min="100"
                    max="220"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    cm
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block">
                  Cân nặng (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    min="30"
                    max="200"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200/60 pb-3">
                <div>
                  <span className="text-xs text-teal-800 font-semibold uppercase tracking-wider block">
                    Chỉ số BMI của bạn:
                  </span>
                  <div className="text-3xl font-extrabold text-teal-950 font-mono mt-0.5">
                    {bmiResult.bmi} <span className="text-sm font-normal text-teal-700">kg/m²</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 block">Đánh giá thể trạng:</span>
                  <span className={`text-base font-extrabold ${bmiResult.mauSac}`}>
                    {bmiResult.phanLoai}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Lời khuyên y khoa: </strong>
                {bmiResult.khuyenNghi}
              </p>
            </div>

            {/* Bảng phân loại WHO Châu Á */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Bảng phân loại BMI dành cho người trưởng thành châu Á:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-800 block">&lt; 18.5</span>
                  <span className="text-[11px] text-slate-600">Thiếu cân (Gầy)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">18.5 – 22.9</span>
                  <span className="text-[11px] text-slate-600">Bình thường (Chuẩn)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-900 block">23.0 – 24.9</span>
                  <span className="text-[11px] text-slate-600">Tiền béo phì</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-bold text-rose-800 block">&ge; 25.0</span>
                  <span className="text-[11px] text-slate-600">Béo phì</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 3: CẨM NANG CHUẨN BỊ */}
      {activeTab === 'prep' && (
        <div className="space-y-6">
          {/* Thanh đo tiến độ sẵn sàng */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Mức độ chuẩn bị cho buổi xét nghiệm:
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đã hoàn thành {completedCount} / {CAM_NANG_CHUAN_BI.length} bước chuẩn bị cần thiết
                </p>
              </div>
              <span className="text-xl font-extrabold text-[#0F766E] font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Thanh tiến độ */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {progressPercent === 100 ? (
              <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tuyệt vời! Bạn đã chuẩn bị đầy đủ các điều kiện để có kết quả xét nghiệm chính xác nhất.
              </div>
            ) : (
              <div className="text-xs text-slate-500 pt-1">
                Hãy tích chọn các bước bạn đã hoàn tất trước khi đến phòng khám hoặc bệnh viện.
              </div>
            )}
          </div>

          {/* Danh sách 6 lưu ý checklist */}
          <div className="space-y-3">
            {CAM_NANG_CHUAN_BI.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isChecked
                      ? 'bg-white border-teal-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox button */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-[#0F766E] text-white'
                          : 'border-2 border-slate-300 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm md:text-base font-bold ${
                            isChecked ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {item.tieuDe}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.tamQuanTrong === 'Bắt buộc'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : item.tamQuanTrong === 'Khuyến nghị'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.tamQuanTrong}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.chiTiet}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-600">Ảnh hưởng chỉ số:</span>
                        {item.cacChiSoAnhHuong.map((metric, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[10px]"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lời khuyên an toàn */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Nếu bạn có bất kỳ bệnh lý mạn tính nào (tiểu đường tiêm Insulin, suy tim đang dùng thuốc chống đông), hãy tuân thủ chỉ dẫn trực tiếp của bác sĩ về việc uống thuốc trước khi lấy mẫu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsScreen;
