import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Info,
  ChevronRight,
  Database,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  THU_VIEN_CHI_SO,
  DANH_SACH_MA_CHI_SO,
  SavedReport,
} from '../data/labDictionary';

export const TrendsScreen: React.FC = () => {
  const { savedReports, currentUser } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<string>('GLU');

  // savedReports chứa phiếu của TẤT CẢ bệnh nhân trong Firestore -> phải lọc theo bệnh nhân đang chọn
  const patientReports = useMemo(() => {
    if (!currentUser) return [];
    return savedReports.filter(
      (r) =>
        (r.patientId && r.patientId === currentUser.id) ||
        (r.patientName && r.patientName.toLowerCase() === currentUser.hoTen.toLowerCase())
    );
  }, [savedReports, currentUser]);

  const activeReports: SavedReport[] = useMemo(() => {
    return [...patientReports].sort(
      (a, b) => new Date(a.ngayXetNghiem).getTime() - new Date(b.ngayXetNghiem).getTime()
    );
  }, [patientReports]);

  const def = THU_VIEN_CHI_SO[selectedMetric];

  // Trích xuất các điểm dữ liệu cho chỉ số đang chọn
  const dataPoints = useMemo(() => {
    return activeReports
      .map((report) => {
        const item = report.chiSo.find((c) => c.ma === selectedMetric);
        const val =
          item && item.giaTri !== null && item.giaTri !== undefined && item.giaTri !== ''
            ? parseFloat(String(item.giaTri))
            : null;
        return {
          date: report.ngayXetNghiem,
          label: report.nhanPhieu,
          val: isNaN(val as number) ? null : val,
          unit: item?.donVi || def?.donVi || '',
        };
      })
      .filter((dp) => dp.val !== null) as Array<{
      date: string;
      label: string;
      val: number;
      unit: string;
    }>;
  }, [activeReports, selectedMetric, def]);

  // Tính toán các thông số thống kê
  const stats = useMemo(() => {
    if (dataPoints.length === 0) return null;
    const values = dataPoints.map((dp) => dp.val);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const latestVal = values[values.length - 1];
    const prevVal = values.length > 1 ? values[values.length - 2] : null;

    let delta: number | null = null;
    let deltaPercent: number | null = null;
    let trend: 'up' | 'down' | 'stable' = 'stable';

    if (prevVal !== null) {
      delta = Number((latestVal - prevVal).toFixed(2));
      deltaPercent = Number(((delta / prevVal) * 100).toFixed(1));
      if (Math.abs(delta) < 0.05) {
        trend = 'stable';
      } else if (delta > 0) {
        trend = 'up';
      } else {
        trend = 'down';
      }
    }

    return { minVal, maxVal, latestVal, prevVal, delta, deltaPercent, trend };
  }, [dataPoints]);

  // Tính toán tọa độ biểu đồ SVG
  const chartGeometry = useMemo(() => {
    if (!def || dataPoints.length === 0) return null;
    const chartW = 600;
    const chartH = 240;
    const paddingX = 50;
    const paddingY = 40;

    const allValues = [
      ...dataPoints.map((d) => d.val),
      def.thamChieuMin,
      def.thamChieuMax,
    ];
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const margin = (rawMax - rawMin) * 0.2 || 1;
    const yMin = Math.max(0, rawMin - margin);
    const yMax = rawMax + margin;

    const getY = (val: number) => {
      const clamped = Math.max(yMin, Math.min(val, yMax));
      return chartH - paddingY - ((clamped - yMin) / (yMax - yMin)) * (chartH - paddingY * 2);
    };

    const getX = (index: number) => {
      if (dataPoints.length === 1) return chartW / 2;
      return (
        paddingX +
        (index / (dataPoints.length - 1)) * (chartW - paddingX * 2)
      );
    };

    const refZoneTop = getY(def.thamChieuMax);
    const refZoneBottom = getY(def.thamChieuMin);
    const refZoneHeight = Math.max(2, refZoneBottom - refZoneTop);

    // Xây dựng đường path
    const pathD = dataPoints
      .map((dp, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(dp.val)}`)
      .join(' ');

    return {
      chartW,
      chartH,
      paddingX,
      paddingY,
      yMin,
      yMax,
      getY,
      getX,
      refZoneTop,
      refZoneBottom,
      refZoneHeight,
      pathD,
    };
  }, [def, dataPoints]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Nút quay lại & Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/history"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Lịch sử</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#0F766E]" />
            Xu hướng Biến thiên Chỉ số Sức khỏe
          </h1>
          <p className="text-sm text-[#475569]">
            Theo dõi diễn tiến các chỉ số qua nhiều mốc thời gian để nhận diện xu hướng ổn định sinh lý.
          </p>
        </div>

        {/* Tổng số phiếu đã lưu của bệnh nhân đang chọn */}
        <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 shrink-0 text-xs font-semibold text-[#0F766E]">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Tổng {patientReports.length} phiếu</span>
        </div>
      </div>

      {/* Danh sách 10 chỉ số dạng Tab ngang chọn nhanh */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          Chọn chỉ số để phân tích xu hướng:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {DANH_SACH_MA_CHI_SO.map((code) => {
            const isSelected = code === selectedMetric;
            const itemDef = THU_VIEN_CHI_SO[code];
            return (
              <button
                key={code}
                onClick={() => setSelectedMetric(code)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="font-bold">{code}</div>
                <div className={`text-[10px] truncate max-w-[80px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                  {itemDef?.tenDayDu.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thẻ đồ thị xu hướng chính */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Header thông tin chỉ số */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {def?.nhom}
              </span>
              <span className="text-xs text-slate-400 font-medium">{def?.coQuan}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {def?.ma} — {def?.tenDayDu}
            </h2>
            {def?.giaiThich && (
              <p className="text-xs text-slate-600 mt-1 max-w-md">{def.giaiThich}</p>
            )}
            <p className="text-xs text-slate-500 mt-1.5">
              Khoảng tham chiếu chuẩn: <strong className="text-slate-700">{def?.khoangThamChieuText}</strong>
            </p>
          </div>

          {/* Quick stats badge */}
          {stats && (
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
              <div>
                <span className="text-[11px] text-slate-500 block">Lần khám gần nhất:</span>
                <span className="text-lg font-bold text-slate-900">
                  {stats.latestVal} <span className="text-xs font-normal text-slate-500">{def?.donVi}</span>
                </span>
              </div>

              {stats.prevVal !== null && stats.delta !== null && (
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[11px] text-slate-500 block">Biến thiên:</span>
                  <div className="flex items-center gap-1 font-semibold text-xs mt-0.5">
                    {stats.trend === 'up' && (
                      <span className="text-amber-800 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                        +{stats.delta} ({stats.deltaPercent}%)
                      </span>
                    )}
                    {stats.trend === 'down' && (
                      <span className="text-sky-800 flex items-center">
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                        {stats.delta} ({stats.deltaPercent}%)
                      </span>
                    )}
                    {stats.trend === 'stable' && (
                      <span className="text-emerald-800 flex items-center">
                        <Minus className="w-3.5 h-3.5 mr-0.5" />
                        Ổn định ({stats.delta})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Biểu đồ SVG trực quan */}
        {chartGeometry && dataPoints.length > 0 ? (
          <div className="space-y-3">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartGeometry.chartW} ${chartGeometry.chartH}`}
                className="w-full h-64 overflow-visible select-none"
              >
                {/* Dải tham chiếu an toàn (Corridor) */}
                <rect
                  x={chartGeometry.paddingX}
                  y={chartGeometry.refZoneTop}
                  width={chartGeometry.chartW - chartGeometry.paddingX * 2}
                  height={chartGeometry.refZoneHeight}
                  fill="#F0FDFA"
                  stroke="#99F6E4"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  rx="4"
                />

                {/* Nhãn dải tham chiếu an toàn */}
                <text
                  x={chartGeometry.chartW - chartGeometry.paddingX - 8}
                  y={chartGeometry.refZoneTop + 14}
                  textAnchor="end"
                  fontSize="10"
                  fill="#0F766E"
                  fontWeight="600"
                >
                  Khoảng tham chiếu an toàn ({def.thamChieuMin} - {def.thamChieuMax})
                </text>

                {/* Trục hoành / Lưới mờ */}
                <line
                  x1={chartGeometry.paddingX}
                  y1={chartGeometry.chartH - chartGeometry.paddingY}
                  x2={chartGeometry.chartW - chartGeometry.paddingX}
                  y2={chartGeometry.chartH - chartGeometry.paddingY}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />

                {/* Đường nối xu hướng (Trend line) */}
                <path
                  d={chartGeometry.pathD}
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Các điểm nút (Data markers) */}
                {dataPoints.map((dp, i) => {
                  const cx = chartGeometry.getX(i);
                  const cy = chartGeometry.getY(dp.val);
                  const inRange = dp.val >= def.thamChieuMin && dp.val <= def.thamChieuMax;

                  return (
                    <g key={i}>
                      {/* Vòng ngoài */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="6"
                        fill={inRange ? '#0F766E' : '#D97706'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all hover:r-8 cursor-pointer"
                      />

                      {/* Giá trị trên đầu điểm */}
                      <text
                        x={cx}
                        y={cy - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#0F172A"
                      >
                        {dp.val}
                      </text>

                      {/* Ngày dưới chân trục */}
                      <text
                        x={cx}
                        y={chartGeometry.chartH - chartGeometry.paddingY + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#64748B"
                        fontWeight="500"
                      >
                        {dp.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Chú giải biểu đồ */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-teal-50 border border-teal-300"></span>
                  <span>Vùng khoảng tham chiếu chuẩn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]"></span>
                  <span>Trong khoảng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>Ngoài khoảng</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Hiển thị {dataPoints.length} lần xét nghiệm
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-sm">
            Chưa có đủ điểm dữ liệu để biểu diễn đồ thị xu hướng cho chỉ số này.
          </div>
        )}

        {/* Lời giải thích y tế trung tính về diễn tiến */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-teal-600" />
            Nhận định biến thiên sinh lý:
          </div>
          <p>
            Các chỉ số sinh hóa máu luôn có sự dao động sinh học tự nhiên giữa các lần xét nghiệm do ảnh hưởng của lượng nước uống, thức ăn gần đây và nhịp sinh học ngày đêm. Sự chênh lệch nhẹ không đồng nghĩa với bệnh lý.
          </p>
        </div>


      </div>
    </div>
  );
};

export default TrendsScreen;
