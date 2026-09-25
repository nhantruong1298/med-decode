import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Camera,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Loader2,
  FileSearch,
  Sparkles,
  CheckCircle2,
  Scan,
  ShieldCheck,
  HelpCircle,
  Eye,
} from 'lucide-react';
import Button from '../components/Button';
import { PrivacyNote } from '../components/Disclaimers';
import { useApp } from '../context/AppContext';
import {
  KICH_BAN_PHIEU_A,
  KICH_BAN_PHIEU_B,
} from '../data/labDictionary';

type ScanMode = 'A' | 'CLEAN' | 'ERROR';

export const UploadScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const {
    currentImage,
    setCurrentImage,
    setCurrentReport,
    selectedDemoScenario,
    setSelectedDemoScenario,
    setIsDirty,
    currentUser,
  } = useApp();

  const [scanMode, setScanMode] = useState<ScanMode>(
    selectedDemoScenario === 'ERROR' ? 'ERROR' : 'A'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(1);
  const [photoError, setPhotoError] = useState<boolean>(false);

  const patientName = currentUser?.hoTen || 'Nguyễn Văn A';
  const patientGender = currentUser?.gioiTinh || 'Nam';
  const patientAge = currentUser ? new Date().getFullYear() - currentUser.namSinh : 32;

  // SVG phiếu mẫu chuẩn
  const defaultSampleImage =
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="%23FFFFFF"><rect width="600" height="750" fill="%23FFFFFF" stroke="%23CBD5E1" stroke-width="2"/><text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230F172A">BỆNH VIỆN ĐA KHOA TRUNG TÂM</text><text x="30" y="75" font-family="sans-serif" font-size="13" fill="%23475569">KHOA XÉT NGHIỆM HUYẾT HỌC - SINH HÓA</text><line x1="30" y1="95" x2="570" y2="95" stroke="%230F766E" stroke-width="2"/><text x="30" y="130" font-family="sans-serif" font-size="14" fill="%23334155">Họ tên: ${patientName} (${patientGender}, ${patientAge} tuổi)</text><text x="380" y="130" font-family="sans-serif" font-size="14" fill="%23334155">Ngày lấy mẫu: 10/09/2026</text><rect x="30" y="160" width="540" height="35" fill="%23F1F5F9"/><text x="45" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">TÊN XÉT NGHIỆM</text><text x="240" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">KẾT QUẢ</text><text x="350" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">ĐƠN VỊ</text><text x="450" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">THAM CHIẾU</text><text x="45" y="225" font-family="sans-serif" font-size="13" fill="%230F172A">WBC (Bạch cầu)</text><text x="240" y="225" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">7.2</text><text x="350" y="225" font-family="sans-serif" font-size="13" fill="%23475569">x10⁹/L</text><text x="450" y="225" font-family="sans-serif" font-size="13" fill="%23475569">4.0 - 10.0</text><text x="45" y="265" font-family="sans-serif" font-size="13" fill="%230F172A">RBC (Hồng cầu)</text><text x="240" y="265" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">4.8</text><text x="350" y="265" font-family="sans-serif" font-size="13" fill="%23475569">x10¹²/L</text><text x="450" y="265" font-family="sans-serif" font-size="13" fill="%23475569">4.0 - 5.8</text><text x="45" y="305" font-family="sans-serif" font-size="13" fill="%230F172A">HGB (Huyết sắc tố)</text><text x="240" y="305" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">145</text><text x="350" y="305" font-family="sans-serif" font-size="13" fill="%23475569">g/L</text><text x="450" y="305" font-family="sans-serif" font-size="13" fill="%23475569">120 - 170</text><text x="45" y="345" font-family="sans-serif" font-size="13" fill="%230F172A">HCT (Dung tích HC)</text><text x="240" y="345" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">42</text><text x="350" y="345" font-family="sans-serif" font-size="13" fill="%23475569">%</text><text x="450" y="345" font-family="sans-serif" font-size="13" fill="%23475569">37 - 50</text><text x="45" y="385" font-family="sans-serif" font-size="13" fill="%230F172A">PLT (Tiểu cầu)</text><text x="240" y="385" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">250</text><text x="350" y="385" font-family="sans-serif" font-size="13" fill="%23475569">x10⁹/L</text><text x="450" y="385" font-family="sans-serif" font-size="13" fill="%23475569">150 - 400</text><text x="45" y="425" font-family="sans-serif" font-size="13" fill="%230F172A">GLU (Glucose đói)</text><text x="240" y="425" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">5.2</text><text x="350" y="425" font-family="sans-serif" font-size="13" fill="%23475569">mmol/L</text><text x="450" y="425" font-family="sans-serif" font-size="13" fill="%23475569">3.9 - 6.4</text><text x="45" y="465" font-family="sans-serif" font-size="13" fill="%230F172A">CHOL (Cholesterol TP)</text><text x="240" y="465" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">5.1</text><text x="350" y="465" font-family="sans-serif" font-size="13" fill="%23475569">mmol/L</text><text x="450" y="465" font-family="sans-serif" font-size="13" fill="%23475569">3.0 - 5.2</text><text x="45" y="505" font-family="sans-serif" font-size="13" fill="%230F172A">CREA (Creatinine)</text><text x="240" y="505" font-family="sans-serif" font-size="13" fill="%2394A3B8">[Mực in mờ]</text><text x="350" y="505" font-family="sans-serif" font-size="13" fill="%23475569">µmol/L</text><text x="450" y="505" font-family="sans-serif" font-size="13" fill="%23475569">62 - 106</text><text x="45" y="545" font-family="sans-serif" font-size="13" fill="%230F172A">AST (SGOT)</text><text x="240" y="545" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">28</text><text x="350" y="545" font-family="sans-serif" font-size="13" fill="%23475569">U/L</text><text x="450" y="545" font-family="sans-serif" font-size="13" fill="%23475569">5 - 40</text><text x="45" y="585" font-family="sans-serif" font-size="13" fill="%230F172A">ALT (SGPT)</text><text x="240" y="585" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">32</text><text x="350" y="585" font-family="sans-serif" font-size="13" fill="%23475569">U/L</text><text x="450" y="585" font-family="sans-serif" font-size="13" fill="%23475569">5 - 41</text><line x1="30" y1="620" x2="570" y2="620" stroke="%23CBD5E1" stroke-width="1"/><text x="400" y="655" font-family="sans-serif" font-size="13" fill="%23334155">BÁC SĨ XÉT NGHIỆM</text><text x="420" y="700" font-family="sans-serif" font-style="italic" font-size="14" fill="%230F766E">Bs. Trần Văn B</text></svg>`;

  const displayImage = currentImage || defaultSampleImage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
        setPhotoError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    setPhotoError(false);
    setIsProcessing(true);
    setProcessingStep(1);

    // Kích hoạt chuỗi tiến trình phân tích thị giác đa bước
    setTimeout(() => setProcessingStep(2), 500);
    setTimeout(() => setProcessingStep(3), 1100);
    setTimeout(() => setProcessingStep(4), 1700);

    setTimeout(() => {
      setIsProcessing(false);

      if (scanMode === 'ERROR') {
        setPhotoError(true);
      } else if (scanMode === 'CLEAN') {
        setCurrentReport({
          ngayXetNghiem: KICH_BAN_PHIEU_B.ngayXetNghiem,
          nhanPhieu: 'Phiếu xét nghiệm tổng quát định kỳ',
          chiSo: JSON.parse(JSON.stringify(KICH_BAN_PHIEU_B.chiSo)),
        });
        setIsDirty(false);
        navigate('/verify');
      } else {
        // Mặc định Kịch bản Phiếu A
        setCurrentReport({
          ngayXetNghiem: KICH_BAN_PHIEU_A.ngayXetNghiem,
          nhanPhieu: KICH_BAN_PHIEU_A.nhanPhieu,
          chiSo: JSON.parse(JSON.stringify(KICH_BAN_PHIEU_A.chiSo)),
        });
        setIsDirty(false);
        navigate('/verify');
      }
    }, 2200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Tiêu đề màn hình */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <Scan className="w-6 h-6 text-[#0F766E]" />
          Tải hoặc chụp phiếu xét nghiệm
        </h1>
        <p className="text-sm text-[#475569]">
          Cung cấp hình ảnh phiếu xét nghiệm rõ chữ, đủ góc cạnh để tiến hành đối chiếu thông tin y khoa.
        </p>
      </div>

      {/* Trạng thái 1: Đang phân tích thông tin với tiến trình đa bước & hiệu ứng laser */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-teal-200 p-8 shadow-md text-left space-y-6 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-[#0F766E] shrink-0 border border-teal-200 shadow-xs">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Đang nhận diện thông tin trên phiếu…
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Hệ thống phân tích quang học đang nhận diện bảng số liệu và 10 chỉ số xét nghiệm.
              </p>
            </div>
          </div>

          {/* Thanh tiến trình đa bước */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-medium">
              <span>Tiến trình phân tích quang học:</span>
              <span className="font-mono font-bold text-teal-700">
                {processingStep === 1 && '25%'}
                {processingStep === 2 && '50%'}
                {processingStep === 3 && '75%'}
                {processingStep === 4 && '100%'}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                style={{ width: `${processingStep * 25}%` }}
              ></div>
            </div>

            <div className="space-y-1.5 pt-2 text-slate-600">
              <div className={`flex items-center gap-2 ${processingStep >= 1 ? 'text-teal-800 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${processingStep >= 1 ? 'text-teal-600' : 'text-slate-300'}`} />
                <span>Bước 1: Cân chỉnh tương phản, khử nhiễu và xoay góc ảnh</span>
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 2 ? 'text-teal-800 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${processingStep >= 2 ? 'text-teal-600' : 'text-slate-300'}`} />
                <span>Bước 2: Phát hiện lưới bảng & phân tách 4 cột (Tên, Kết quả, Đơn vị, Tham chiếu)</span>
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 3 ? 'text-teal-800 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${processingStep >= 3 ? 'text-teal-600' : 'text-slate-300'}`} />
                <span>Bước 3: Đối chiếu danh mục 10 chỉ số huyết học & sinh hóa máu</span>
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 4 ? 'text-teal-800 font-medium' : 'text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${processingStep >= 4 ? 'text-teal-600' : 'text-slate-300'}`} />
                <span>Bước 4: Sẵn sàng dữ liệu cho màn hình kiểm tra hai chiều!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trạng thái 2: Ảnh không rõ */}
      {photoError && !isProcessing && (
        <div className="bg-red-50/90 rounded-2xl border border-red-200 p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#B91C1C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#B91C1C]">
                Một số nội dung trên ảnh chưa đọc được. Hãy chụp đủ phiếu, rõ chữ và tránh lóa sáng.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Vui lòng kiểm tra lại chất lượng hình ảnh, độ nét và góc chiếu sáng trước khi tiếp tục.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              icon={<Camera className="w-4 h-4" />}
              onClick={() => {
                setPhotoError(false);
                cameraInputRef.current?.click();
              }}
            >
              Chụp lại
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => {
                setPhotoError(false);
                fileInputRef.current?.click();
              }}
            >
              Chọn ảnh khác
            </Button>
          </div>
        </div>
      )}

      {/* Khu vực xem trước ảnh và thao tác */}
      {!isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 text-left shadow-xs">
          {/* Vùng xem trước ảnh kèm laser scan effect */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-teal-700" />
                Xem trước ảnh phiếu xét nghiệm
              </span>
              {currentImage ? (
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  Đã tải ảnh người dùng
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Ảnh mẫu chuẩn: {patientName}
                </span>
              )}
            </div>

            <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px] p-2">
              <img
                src={displayImage}
                alt="Phiếu xét nghiệm máu"
                className="max-h-[440px] w-auto object-contain rounded"
              />

              {/* Laser scan line overlay */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent pointer-events-none animate-laser shadow-[0_0_12px_#0F766E]" />
            </div>
          </div>

          {/* Ẩn input file/camera thực tế */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Các nút Thay ảnh và Tiếp tục */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-1/2"
            >
              Chọn ảnh khác
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={handleContinue}
              className="w-full sm:w-1/2"
            >
              Bắt đầu nhận diện & đối chiếu
            </Button>
          </div>

          {/* Dòng chú thích quyền riêng tư */}
          <PrivacyNote />

          {/* BỘ CHỌN MẪU DỮ LIỆU KIỂM TRA */}
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 bg-slate-50/90 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                <span>Bộ chọn mẫu dữ liệu kiểm tra</span>
              </div>
              <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Phiếu kiểm thử
              </span>
            </div>

            <p className="text-xs text-[#475569]">
              Chọn kịch bản mong muốn để quan sát phản hồi của giao diện:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Kịch bản 1: Phiếu A có lỗi */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  scanMode === 'A'
                    ? 'border-[#0F766E] bg-teal-50/60 text-[#0F766E] font-medium shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="scanMode"
                  value="A"
                  checked={scanMode === 'A'}
                  onChange={() => {
                    setScanMode('A');
                    setSelectedDemoScenario('A');
                  }}
                  className="mt-0.5 text-[#0F766E] focus:ring-[#0F766E]"
                />
                <div>
                  <span className="font-semibold block text-slate-900">
                    Phiếu A (có lỗi cần sửa)
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Cholesterol đọc 6.1 (ảnh gốc 5.1), Creatinine trống
                  </span>
                </div>
              </label>

              {/* Kịch bản 2: Phiếu chuẩn 10/10 chỉ số */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  scanMode === 'CLEAN'
                    ? 'border-[#0F766E] bg-teal-50/60 text-[#0F766E] font-medium shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="scanMode"
                  value="CLEAN"
                  checked={scanMode === 'CLEAN'}
                  onChange={() => {
                    setScanMode('CLEAN');
                  }}
                  className="mt-0.5 text-[#0F766E] focus:ring-[#0F766E]"
                />
                <div>
                  <span className="font-semibold block text-slate-900">
                    Phiếu chuẩn (10/10 đủ)
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Tất cả chỉ số hợp lệ, kiểm tra luồng xem kết quả nhanh
                  </span>
                </div>
              </label>

              {/* Kịch bản 3: Mô phỏng lỗi ảnh mờ */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  scanMode === 'ERROR'
                    ? 'border-[#B91C1C] bg-red-50/60 text-[#B91C1C] font-medium shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="scanMode"
                  value="ERROR"
                  checked={scanMode === 'ERROR'}
                  onChange={() => {
                    setScanMode('ERROR');
                    setSelectedDemoScenario('ERROR');
                  }}
                  className="mt-0.5 text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-semibold block text-slate-900">
                    Ảnh không rõ (mô phỏng lỗi)
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Mô phỏng trường hợp ảnh mờ/lóa sáng để kiểm tra thông báo lỗi
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
