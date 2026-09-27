import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Scan,
  Eye,
  Bot,
  Image as ImageIcon,
} from 'lucide-react';
import Button from '../components/Button';
import { PrivacyNote } from '../components/Disclaimers';
import { useApp } from '../context/AppContext';
import {
  DANH_SACH_MA_CHI_SO,
  THU_VIEN_CHI_SO,
  ChiSoItem,
} from '../data/labDictionary';

interface AIScanResultData {
  ngayXetNghiem?: string;
  nhanPhieu?: string;
  benhNhan?: string;
  chiSo?: Array<{
    ma?: string;
    tenChiSo?: string;
    giaTri?: number | string | null;
    donVi?: string;
    thamChieu?: string;
  }>;
  tongSoDocDuoc?: number;
  ghiChu?: string;
  rawText?: string;
}

export const UploadScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentImage,
    setCurrentImage,
    setCurrentReport,
    setIsDirty,
    currentUser,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatusText, setProcessingStatusText] = useState<string>('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [aiScanResult, setAiScanResult] = useState<AIScanResultData | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Xử lý khi người dùng chọn file ảnh từ máy
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
        setPhotoError(null);
        setAiScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quét và trích xuất bằng AI
  const handleScanWithAI = async () => {
    if (!currentImage) {
      setPhotoError('Vui lòng chọn một hình ảnh phiếu xét nghiệm trước khi bắt đầu quét.');
      return;
    }

    setPhotoError(null);
    setIsProcessing(true);
    setProcessingStatusText('Đang nạp hình ảnh và kết nối AI đọc dữ liệu...');

    try {
      setProcessingStatusText('AI đang nhận diện chữ viết, ngày xét nghiệm và bảng chỉ số...');

      const response = await fetch('/api/scan-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: currentImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'AI không nhận diện được nội dung phiếu xét nghiệm.');
      }

      const data: AIScanResultData = result.data;
      setAiScanResult(data);

      // Chuẩn hóa danh sách chỉ số vào định dạng ChiSoItem[]
      const extractedList = data.chiSo || [];

      const mappedChiSo: ChiSoItem[] = DANH_SACH_MA_CHI_SO.map((ma) => {
        const def = THU_VIEN_CHI_SO[ma];
        const found = extractedList.find(
          (item) =>
            item.ma?.toUpperCase() === ma ||
            item.tenChiSo?.toLowerCase().includes(def.tenDayDu.toLowerCase()) ||
            (ma === 'GLU' && item.tenChiSo?.toLowerCase().includes('glucose')) ||
            (ma === 'CHOL' && item.tenChiSo?.toLowerCase().includes('cholesterol')) ||
            (ma === 'CREA' && item.tenChiSo?.toLowerCase().includes('creatinine')) ||
            (ma === 'AST' && (item.tenChiSo?.toLowerCase().includes('ast') || item.tenChiSo?.toLowerCase().includes('sgot'))) ||
            (ma === 'ALT' && (item.tenChiSo?.toLowerCase().includes('alt') || item.tenChiSo?.toLowerCase().includes('sgpt'))) ||
            (ma === 'WBC' && item.tenChiSo?.toLowerCase().includes('bạch cầu')) ||
            (ma === 'RBC' && item.tenChiSo?.toLowerCase().includes('hồng cầu')) ||
            (ma === 'HGB' && (item.tenChiSo?.toLowerCase().includes('huyết sắc tố') || item.tenChiSo?.toLowerCase().includes('hemoglobin'))) ||
            (ma === 'HCT' && (item.tenChiSo?.toLowerCase().includes('hematocrit') || item.tenChiSo?.toLowerCase().includes('dung tích'))) ||
            (ma === 'PLT' && item.tenChiSo?.toLowerCase().includes('tiểu cầu'))
        );

        return {
          ma,
          giaTri: found && found.giaTri !== undefined && found.giaTri !== null ? found.giaTri : '',
          donVi: found?.donVi || def.donVi,
        };
      });

      // Nếu có thêm các chỉ số phụ ngoài 10 chỉ số chuẩn, bổ sung vào danh sách
      extractedList.forEach((extra) => {
        if (!extra.ma) return;
        const upperMa = extra.ma.toUpperCase();
        if (!DANH_SACH_MA_CHI_SO.includes(upperMa) && !mappedChiSo.some((c) => c.ma === upperMa)) {
          mappedChiSo.push({
            ma: upperMa,
            giaTri: extra.giaTri !== undefined && extra.giaTri !== null ? extra.giaTri : '',
            donVi: extra.donVi || '',
          });
        }
      });

      const todayStr = new Date().toISOString().split('T')[0];
      const ngayPhieu = data.ngayXetNghiem || todayStr;
      const tieuDePhieu = data.nhanPhieu || 'Phiếu xét nghiệm máu (AI Quét)';

      setCurrentReport({
        ngayXetNghiem: ngayPhieu,
        nhanPhieu: tieuDePhieu,
        chiSo: mappedChiSo,
      });
      setIsDirty(false);
    } catch (err: any) {
      console.warn('AI Scan lỗi:', err);
      setPhotoError(
        err?.message ||
          'Không thể đọc nội dung ảnh bằng AI. Vui lòng kiểm tra lại ảnh có rõ chữ và đủ ánh sáng không.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Thông tin hồ sơ bệnh nhân đang xét nghiệm */}
      {currentUser && (
        <div className="bg-teal-50/80 border border-teal-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-left text-xs">
          <div className="flex items-center gap-2">
            <span className="text-teal-700 font-medium">Bệnh nhân:</span>
            <span className="font-bold text-slate-900">{currentUser.hoTen}</span>
            <span className="font-mono text-teal-800 font-semibold bg-white px-1.5 py-0.5 rounded border border-teal-200">
              {currentUser.maHoSo}
            </span>
            <span className="text-slate-500 hidden sm:inline">
              ({currentUser.gioiTinh}, {new Date().getFullYear() - currentUser.namSinh} tuổi)
            </span>
          </div>
        </div>
      )}

      {/* Tiêu đề màn hình */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <Scan className="w-6 h-6 text-[#0F766E]" />
          Đọc và quét phiếu xét nghiệm bằng AI
        </h1>
        <p className="text-sm text-[#475569]">
          Chọn ảnh phiếu xét nghiệm từ thiết bị của bạn để AI tự động quét và đọc thông tin.
        </p>
      </div>

      {/* Trạng thái: Đang quét hình ảnh với AI */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-teal-200 p-8 shadow-md text-left space-y-5 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-[#0F766E] shrink-0 border border-teal-200 shadow-xs">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#0F766E]" />
                <h3 className="text-lg font-bold text-[#0F172A]">
                  AI đang quét và đọc ảnh phiếu xét nghiệm…
                </h3>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                {processingStatusText || 'Đang trích xuất ngày lấy mẫu, bảng chỉ số và đơn vị đo.'}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-[11px] text-slate-500 text-center italic">
              Sử dụng mô hình thị giác AI Gemini 3.8 Flash xử lý trực tiếp hình ảnh
            </p>
          </div>
        </div>
      )}

      {/* Trạng thái: Báo lỗi nếu ảnh mờ hoặc lỗi server */}
      {photoError && !isProcessing && (
        <div className="bg-red-50/90 rounded-2xl border border-red-200 p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#B91C1C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#B91C1C]">
                Chưa thể đọc đầy đủ nội dung từ hình ảnh
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {photoError}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Gợi ý: Chọn ảnh chụp rõ chữ, đủ ánh sáng và không bị lóa hoặc bóng mờ che khuất cột kết quả.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => {
                setPhotoError(null);
                fileInputRef.current?.click();
              }}
            >
              Chọn lại ảnh khác
            </Button>
          </div>
        </div>
      )}

      {/* Kết quả đọc được từ AI */}
      {aiScanResult && !isProcessing && (
        <div className="bg-emerald-50/80 rounded-2xl border border-emerald-300 p-5 sm:p-6 text-left space-y-4 animate-in fade-in shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  AI đã đọc thành công phiếu xét nghiệm!
                </h3>
                <p className="text-xs text-emerald-800">
                  {aiScanResult.nhanPhieu || 'Phiếu xét nghiệm'} · Ngày:{' '}
                  <span className="font-semibold">{aiScanResult.ngayXetNghiem || 'Hôm nay'}</span>
                  {aiScanResult.benhNhan ? ` · Bệnh nhân: ${aiScanResult.benhNhan}` : ''}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              {aiScanResult.chiSo?.length || 0} chỉ số
            </span>
          </div>

          {/* Danh sách chỉ số AI đã bóc tách */}
          <div className="bg-white rounded-xl border border-emerald-200 p-3 space-y-2 max-h-52 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-700 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Chỉ số AI đọc được:</span>
              <span className="text-[11px] text-slate-500">Kết quả & Đơn vị</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {aiScanResult.chiSo?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-800 truncate mr-2">
                    {item.ma || item.tenChiSo || `Chỉ số ${idx + 1}`}
                  </span>
                  <span className="font-mono font-bold text-teal-700 shrink-0">
                    {item.giaTri !== '' && item.giaTri !== null && item.giaTri !== undefined
                      ? `${item.giaTri} ${item.donVi || ''}`
                      : '(cần điền tay)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {aiScanResult.ghiChu && (
            <div className="text-xs text-emerald-900 bg-emerald-100/60 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-2">
              <Bot className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>Ghi chú AI: {aiScanResult.ghiChu}</span>
            </div>
          )}

          {/* Nút hành động tiếp tục sang màn hình Verify */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/verify')}
              className="w-full justify-center"
            >
              Tiếp tục đối chiếu thông tin với ảnh gốc
            </Button>
          </div>
        </div>
      )}

      {/* Khu vực chọn ảnh & xem trước */}
      {!isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 text-left shadow-xs">
          {/* Input file ẩn */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!currentImage ? (
            /* Chưa có ảnh: Khung bấm chọn ảnh thân thiện */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50/70 p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center min-h-[300px] group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-teal-200 flex items-center justify-center text-[#0F766E] mb-4 group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                Bấm vào đây để chọn ảnh phiếu xét nghiệm
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mb-4">
                Chọn tệp hình ảnh phiếu xét nghiệm máu từ máy tính hoặc điện thoại của bạn
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
                <ImageIcon className="w-3.5 h-3.5" />
                Hỗ trợ PNG, JPG, JPEG, WebP
              </span>
            </div>
          ) : (
            /* Đã có ảnh: Xem trước ảnh và nút quét AI */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-teal-700" />
                  Ảnh phiếu xét nghiệm đã chọn
                </span>
                {selectedFileName && (
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded font-medium border border-emerald-200 max-w-[220px] truncate">
                    Tệp: {selectedFileName}
                  </span>
                )}
              </div>

              <div className="relative rounded-xl border-2 border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[460px] p-2">
                <img
                  src={currentImage}
                  alt="Phiếu xét nghiệm máu"
                  className="max-h-[440px] w-auto object-contain rounded"
                />

                {/* Laser scan line overlay */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent pointer-events-none animate-laser shadow-[0_0_12px_#0F766E]" />
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  variant="outline"
                  size="md"
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-1/3 justify-center"
                >
                  Chọn ảnh khác
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Bot className="w-5 h-5 text-teal-200" />}
                  onClick={handleScanWithAI}
                  className="w-full sm:w-2/3 justify-center text-base py-3 shadow-md shadow-teal-900/10 font-semibold"
                >
                  Quét & đọc thông tin bằng AI
                </Button>
              </div>
            </div>
          )}

          {/* Dòng chú thích quyền riêng tư */}
          <PrivacyNote />
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
