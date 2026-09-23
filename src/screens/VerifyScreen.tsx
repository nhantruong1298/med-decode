import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import {
  THU_VIEN_CHI_SO,
  DANH_SACH_MA_CHI_SO,
} from '../data/labDictionary';

/**
 * Màn hình 3: Kiểm tra thông tin (FR03)
 * - Ảnh gốc (phóng to được) đặt cạnh danh sách trường dữ liệu đã nhận diện
 * - Ngày xét nghiệm + 10 chỉ số (tên, giá trị, đơn vị) dạng input chỉnh sửa được
 * - Trường sai/thiếu có viền cảnh báo + thông báo tương ứng:
 *   "Chưa có [tên trường]. Vui lòng kiểm tra và bổ sung từ phiếu xét nghiệm."
 * - Thông báo đầu trang: "Vui lòng đối chiếu thông tin bên dưới với ảnh phiếu trước khi tiếp tục."
 * - Nút "Xác nhận thông tin" ở cuối
 * - Đường quay lại để thay ảnh (có ConfirmDialog nếu có thay đổi chưa lưu)
 */
export const VerifyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentImage, currentReport, setCurrentReport, isDirty, setIsDirty } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Nếu người dùng truy cập trực tiếp khi chưa có currentReport
  if (!currentReport) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-slate-600">Chưa có thông tin phiếu xét nghiệm đang xử lý.</p>
        <Button onClick={() => navigate('/upload')}>Tải ảnh phiếu mới</Button>
      </div>
    );
  }

  const defaultSampleImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="%23FFFFFF"><rect width="600" height="750" fill="%23FFFFFF" stroke="%23CBD5E1" stroke-width="2"/><text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230F172A">BỆNH VIỆN ĐA KHOA TRUNG TÂM</text><text x="30" y="75" font-family="sans-serif" font-size="13" fill="%23475569">KHOA XÉT NGHIỆM HUYẾT HỌC - SINH HÓA</text><line x1="30" y1="95" x2="570" y2="95" stroke="%230F766E" stroke-width="2"/><text x="30" y="130" font-family="sans-serif" font-size="14" fill="%23334155">Họ tên: Nguyễn Văn A (Nam, 32 tuổi)</text><text x="380" y="130" font-family="sans-serif" font-size="14" fill="%23334155">Ngày lấy mẫu: 10/09/2026</text><rect x="30" y="160" width="540" height="35" fill="%23F1F5F9"/><text x="45" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">TÊN XÉT NGHIỆM</text><text x="240" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">KẾT QUẢ</text><text x="350" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">ĐƠN VỊ</text><text x="450" y="183" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">THAM CHIẾU</text><text x="45" y="225" font-family="sans-serif" font-size="13" fill="%230F172A">WBC (Bạch cầu)</text><text x="240" y="225" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">7.2</text><text x="350" y="225" font-family="sans-serif" font-size="13" fill="%23475569">x10⁹/L</text><text x="450" y="225" font-family="sans-serif" font-size="13" fill="%23475569">4.0 - 10.0</text><text x="45" y="265" font-family="sans-serif" font-size="13" fill="%230F172A">RBC (Hồng cầu)</text><text x="240" y="265" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">4.8</text><text x="350" y="265" font-family="sans-serif" font-size="13" fill="%23475569">x10¹²/L</text><text x="450" y="265" font-family="sans-serif" font-size="13" fill="%23475569">4.0 - 5.8</text><text x="45" y="305" font-family="sans-serif" font-size="13" fill="%230F172A">HGB (Huyết sắc tố)</text><text x="240" y="305" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">145</text><text x="350" y="305" font-family="sans-serif" font-size="13" fill="%23475569">g/L</text><text x="450" y="305" font-family="sans-serif" font-size="13" fill="%23475569">120 - 170</text><text x="45" y="345" font-family="sans-serif" font-size="13" fill="%230F172A">HCT (Dung tích HC)</text><text x="240" y="345" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">42</text><text x="350" y="345" font-family="sans-serif" font-size="13" fill="%23475569">%</text><text x="450" y="345" font-family="sans-serif" font-size="13" fill="%23475569">37 - 50</text><text x="45" y="385" font-family="sans-serif" font-size="13" fill="%230F172A">PLT (Tiểu cầu)</text><text x="240" y="385" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">250</text><text x="350" y="385" font-family="sans-serif" font-size="13" fill="%23475569">x10⁹/L</text><text x="450" y="385" font-family="sans-serif" font-size="13" fill="%23475569">150 - 400</text><text x="45" y="425" font-family="sans-serif" font-size="13" fill="%230F172A">GLU (Glucose đói)</text><text x="240" y="425" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">5.2</text><text x="350" y="425" font-family="sans-serif" font-size="13" fill="%23475569">mmol/L</text><text x="450" y="425" font-family="sans-serif" font-size="13" fill="%23475569">3.9 - 6.4</text><text x="45" y="465" font-family="sans-serif" font-size="13" fill="%230F172A">CHOL (Cholesterol TP)</text><text x="240" y="465" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">5.1</text><text x="350" y="465" font-family="sans-serif" font-size="13" fill="%23475569">mmol/L</text><text x="450" y="465" font-family="sans-serif" font-size="13" fill="%23475569">3.0 - 5.2</text><text x="45" y="505" font-family="sans-serif" font-size="13" fill="%230F172A">CREA (Creatinine)</text><text x="240" y="505" font-family="sans-serif" font-size="13" fill="%2394A3B8">[Mực in mờ - 80]</text><text x="350" y="505" font-family="sans-serif" font-size="13" fill="%23475569">µmol/L</text><text x="450" y="505" font-family="sans-serif" font-size="13" fill="%23475569">62 - 106</text><text x="45" y="545" font-family="sans-serif" font-size="13" fill="%230F172A">AST (SGOT)</text><text x="240" y="545" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">28</text><text x="350" y="545" font-family="sans-serif" font-size="13" fill="%23475569">U/L</text><text x="450" y="545" font-family="sans-serif" font-size="13" fill="%23475569">5 - 40</text><text x="45" y="585" font-family="sans-serif" font-size="13" fill="%230F172A">ALT (SGPT)</text><text x="240" y="585" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230F172A">32</text><text x="350" y="585" font-family="sans-serif" font-size="13" fill="%23475569">U/L</text><text x="450" y="585" font-family="sans-serif" font-size="13" fill="%23475569">5 - 41</text><line x1="30" y1="620" x2="570" y2="620" stroke="%23CBD5E1" stroke-width="1"/><text x="400" y="655" font-family="sans-serif" font-size="13" fill="%23334155">BÁC SĨ XÉT NGHIỆM</text><text x="420" y="700" font-family="sans-serif" font-style="italic" font-size="14" fill="%230F766E">Bs. Trần Văn B</text></svg>';

  const displayImage = currentImage || defaultSampleImage;

  // Cập nhật giá trị chỉ số
  const handleValueChange = (ma: string, valStr: string) => {
    setIsDirty(true);
    setCurrentReport((prev) => {
      if (!prev) return null;
      const updated = prev.chiSo.map((item) => {
        if (item.ma === ma) {
          return { ...item, giaTri: valStr };
        }
        return item;
      });
      return { ...prev, chiSo: updated };
    });

    // Xóa lỗi nếu đã nhập
    if (errors[ma]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[ma];
        return next;
      });
    }
  };

  const handleDateChange = (newDate: string) => {
    setIsDirty(true);
    setCurrentReport((prev) => (prev ? { ...prev, ngayXetNghiem: newDate } : null));
    if (errors['ngayXetNghiem']) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next['ngayXetNghiem'];
        return next;
      });
    }
  };

  // Xác nhận thông tin
  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentReport.ngayXetNghiem) {
      newErrors['ngayXetNghiem'] = 'Chưa có ngày xét nghiệm. Vui lòng kiểm tra và bổ sung từ phiếu xét nghiệm.';
    }

    // Kiểm tra các trường thiếu
    currentReport.chiSo.forEach((item) => {
      const def = THU_VIEN_CHI_SO[item.ma];
      const tenTruong = def ? def.tenDayDu : item.ma;
      if (item.giaTri === '' || item.giaTri === null || item.giaTri === undefined) {
        // Thông báo thiếu thông tin theo đúng nguyên văn mục 7:
        // "Chưa có [tên trường]. Vui lòng kiểm tra và bổ sung từ phiếu xét nghiệm."
        newErrors[item.ma] = `Chưa có ${tenTruong}. Vui lòng kiểm tra và bổ sung từ phiếu xét nghiệm.`;
      } else if (isNaN(Number(item.giaTri))) {
        newErrors[item.ma] = `Giá trị của ${tenTruong} phải là số hợp lệ.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Cuộn lên phần tử lỗi đầu tiên
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`input-${firstKey.toLowerCase()}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Chuyển sang màn hình Dashboard Kết quả
    navigate('/dashboard');
  };

  // Xử lý nút quay lại
  const handleBack = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Tiêu đề & nút quay lại */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] hover:underline mb-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại tải ảnh</span>
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A]">Kiểm tra thông tin phiếu</h1>
        </div>

        <Button
          variant="primary"
          icon={<CheckCircle2 className="w-4 h-4" />}
          onClick={handleConfirm}
        >
          Xác nhận thông tin
        </Button>
      </div>

      {/* Thông báo bắt buộc đối chiếu (dùng đúng nguyên văn mục 7) */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-left flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#92400E]">Cần kiểm tra dữ liệu</p>
          <p className="text-sm text-slate-700">
            Vui lòng đối chiếu thông tin bên dưới với ảnh phiếu trước khi tiếp tục.
          </p>
        </div>
      </div>

      {/* Bố cục 2 cột cạnh nhau: Ảnh gốc & Danh sách trường dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: Ảnh gốc có khả năng zoom */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-3 sticky top-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0F172A]">
              Ảnh phiếu xét nghiệm gốc
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 px-1 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"
                title="Đặt lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative rounded-lg border border-slate-200 bg-slate-100 overflow-auto max-h-[550px] p-2 flex items-center justify-center">
            <img
              src={displayImage}
              alt="Ảnh phiếu xét nghiệm gốc"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 max-w-full"
            />
          </div>

          <div className="text-xs text-[#475569] text-left">
            <p className="font-medium text-slate-700">Mẹo đối chiếu kiểm thử:</p>
            <p>• Cholesterol trong ảnh là 5.1 (được nhận diện sai thành 6.1)</p>
            <p>• Creatinine trên ảnh ghi 80 nhưng mực in mờ nên hệ thống để trống</p>
          </div>
        </div>

        {/* CỘT PHẢI: Danh sách trường dữ liệu "đã nhận diện" */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-6 text-left shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Thông tin nhận diện được (có thể chỉnh sửa)
            </h2>
            <p className="text-xs text-[#475569]">
              Bạn có thể chạm vào từng ô để sửa giá trị cho khớp với ảnh gốc.
            </p>
          </div>

          {/* Ngày xét nghiệm */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <InputField
              id="input-ngayxetnghiem"
              label="Ngày xét nghiệm"
              type="date"
              value={currentReport.ngayXetNghiem}
              onChange={(e) => handleDateChange(e.target.value)}
              error={errors['ngayXetNghiem']}
            />
          </div>

          {/* Danh sách 10 chỉ số */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A] border-b border-slate-100 pb-2">
              Bộ 10 chỉ số xét nghiệm huyết học & sinh hóa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DANH_SACH_MA_CHI_SO.map((ma) => {
                const def = THU_VIEN_CHI_SO[ma];
                const item = currentReport.chiSo.find((c) => c.ma === ma) || {
                  ma,
                  giaTri: '',
                  donVi: def.donVi,
                };

                const isMissing = item.giaTri === '' || item.giaTri === null || item.giaTri === undefined;
                // Nhắc người dùng nếu là Cholesterol (chưa khớp ảnh) hoặc Creatinine (trống)
                const isCholesterolNeedsCheck = ma === 'CHOL' && Number(item.giaTri) === 6.1;
                const warningMsg = isCholesterolNeedsCheck
                  ? 'Ảnh gốc ghi 5.1 mmol/L. Hãy kiểm tra lại số liệu.'
                  : undefined;

                return (
                  <div
                    key={ma}
                    className={`p-3 rounded-lg border transition-all ${
                      errors[ma]
                        ? 'border-red-300 bg-red-50/20'
                        : isCholesterolNeedsCheck
                        ? 'border-amber-300 bg-amber-50/20'
                        : isMissing
                        ? 'border-dashed border-slate-300 bg-slate-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <InputField
                      id={`input-${ma.toLowerCase()}`}
                      label={`${ma} • ${def ? def.tenDayDu : ma}`}
                      unit={item.donVi || def.donVi}
                      value={item.giaTri !== null && item.giaTri !== undefined ? item.giaTri : ''}
                      onChange={(e) => handleValueChange(ma, e.target.value)}
                      placeholder="Nhập giá trị từ phiếu"
                      error={errors[ma]}
                      warning={warningMsg}
                      helperText={`Tham chiếu: ${def ? def.khoangThamChieuText : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nút Xác nhận thông tin ở cuối */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={handleBack}>
              Quay lại thay ảnh
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<CheckCircle2 className="w-5 h-5" />}
              onClick={handleConfirm}
            >
              Xác nhận thông tin
            </Button>
          </div>
        </div>
      </div>

      {/* Hộp thoại xác nhận khi hủy thao tác có thay đổi chưa lưu (theo đúng nguyên văn mục 7) */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Bỏ thay đổi chưa lưu?"
        message="Các thông tin chỉnh sửa trên phiếu hiện tại sẽ bị xóa nếu bạn quay lại màn hình tải ảnh."
        cancelLabel="Tiếp tục chỉnh sửa"
        confirmLabel="Bỏ thay đổi"
        onCancel={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setIsDirty(false);
          setShowExitConfirm(false);
          navigate('/upload');
        }}
      />
    </div>
  );
};

export default VerifyScreen;
