import React from 'react';
import { Printer, X, ShieldCheck, Download, Calendar, Activity, User } from 'lucide-react';
import { ChiSoItem, THU_VIEN_CHI_SO, tinhTrangThaiChiSo } from '../data/labDictionary';
import { useApp } from '../context/AppContext';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  };
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const { currentUser } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const patientName = currentUser?.hoTen || 'Nguyễn Văn A';
  const patientGender = currentUser?.gioiTinh || 'Nam';
  const patientAge = currentUser ? new Date().getFullYear() - currentUser.namSinh : 32;
  const patientCode = currentUser?.maHoSo || 'BN-88421';
  const patientBlood = currentUser?.nhomMau || 'O+';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-slate-200 text-left">
        {/* Actions bar (Ẩn khi in thực tế) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
          <div className="flex items-center gap-2 text-teal-700">
            <Printer className="w-5 h-5" />
            <span className="font-bold text-slate-800 text-base md:text-lg">
              Bản in Tóm tắt Kết quả Xét nghiệm Y khoa
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D655E] text-white text-sm font-semibold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>In phiếu / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung nội dung in ấn chuẩn y tế */}
        <div id="printable-medical-report" className="space-y-6 bg-white p-2">
          {/* Header Bệnh viện / Cơ sở y tế */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-teal-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#0F766E]">
                <Activity className="w-6 h-6" />
                <span className="font-extrabold text-xl tracking-tight text-slate-900 uppercase">
                  MEDDECODE CLINICAL REPORT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Hệ thống Quản lý & Đối chiếu Kết quả Xét nghiệm Máu
              </p>
              <p className="text-xs text-slate-400">
                Mã hồ sơ điện tử: MD-{report.ngayXetNghiem.replace(/-/g, '')}-{patientCode}
              </p>
            </div>

            {/* Mã QR giả lập xác thực bảo mật */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <svg
                className="w-14 h-14 text-slate-800 shrink-0"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* QR Code graphic pattern */}
                <rect x="5" y="5" width="25" height="25" fill="#0F766E" rx="3" />
                <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
                <rect x="14" y="14" width="7" height="7" fill="#0F766E" />
                <rect x="70" y="5" width="25" height="25" fill="#0F766E" rx="3" />
                <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
                <rect x="79" y="14" width="7" height="7" fill="#0F766E" />
                <rect x="5" y="70" width="25" height="25" fill="#0F766E" rx="3" />
                <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" rx="2" />
                <rect x="14" y="79" width="7" height="7" fill="#0F766E" />
                <rect x="35" y="10" width="10" height="20" fill="#334155" />
                <rect x="50" y="15" width="15" height="10" fill="#334155" />
                <rect x="35" y="45" width="30" height="15" fill="#0F766E" />
                <rect x="70" y="45" width="20" height="10" fill="#334155" />
                <rect x="40" y="70" width="15" height="20" fill="#334155" />
                <rect x="65" y="70" width="25" height="15" fill="#0F766E" />
              </svg>
              <div className="text-[11px] leading-tight text-slate-500">
                <span className="font-semibold text-slate-700 block">Xác thực hồ sơ:</span>
                Cơ sở dữ liệu
                <br />
                <span className="text-[10px] text-teal-600 font-mono">MD-DA-XAC-THUC</span>
              </div>
            </div>
          </div>

          {/* Thông tin Bệnh nhân & Phiếu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs border border-slate-200">
            <div>
              <span className="text-slate-500 block">Họ tên bệnh nhân:</span>
              <span className="font-bold text-slate-900 text-sm">{patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Giới tính & Tuổi:</span>
              <span className="font-semibold text-slate-800">
                {patientGender} · {patientAge} tuổi (Nhóm {patientBlood})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Mã bệnh nhân (ID):</span>
              <span className="font-semibold text-teal-700 font-mono">{patientCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ngày xét nghiệm:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {report.ngayXetNghiem}
              </span>
            </div>
          </div>

          {/* Bảng kết quả 10 chỉ số */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-semibold">
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Tên xét nghiệm</th>
                  <th className="py-2.5 px-3 text-right">Kết quả</th>
                  <th className="py-2.5 px-3">Đơn vị</th>
                  <th className="py-2.5 px-3">Khoảng tham chiếu</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái đối chiếu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.chiSo.map((item, index) => {
                  const def = THU_VIEN_CHI_SO[item.ma];
                  const status = tinhTrangThaiChiSo(item.giaTri, item.ma);
                  const isNormal = status === 'Trong khoảng tham chiếu';
                  const isOutOfRange = status === 'Thấp hơn' || status === 'Cao hơn';

                  return (
                    <tr
                      key={item.ma}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <td className="py-2 px-3 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-800">
                          {item.ma}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {def?.tenDayDu || item.ma}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                        {item.giaTri !== null && item.giaTri !== undefined && item.giaTri !== ''
                          ? item.giaTri
                          : '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-medium">{item.donVi}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">
                        {def?.khoangThamChieuText || '—'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {isNormal ? (
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                            Trong chuẩn
                          </span>
                        ) : isOutOfRange ? (
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-amber-800 bg-amber-50 rounded border border-amber-200">
                            {status}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 rounded">
                            Chưa rõ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Lời nhắc y tế trung tính */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Lưu ý nguyên tắc trung tính của MedDecode:
            </div>
            <p>
              Bản in này được sinh ra nhằm mục đích đối chiếu và lưu trữ thông tin cá nhân. MedDecode hỗ trợ đọc hiểu thông tin trên phiếu xét nghiệm, không chẩn đoán bệnh. Kết quả xét nghiệm cần được bác sĩ đánh giá trong bệnh cảnh lâm sàng cụ thể.
            </p>
          </div>

          {/* Vùng ghi chú và chữ ký bác sĩ */}
          <div className="grid grid-cols-2 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1 pr-4">
              <span className="font-semibold text-slate-700 block">Ý kiến tư vấn của Bác sĩ:</span>
              <div className="border-b border-dashed border-slate-300 h-6"></div>
              <div className="border-b border-dashed border-slate-300 h-6"></div>
              <div className="border-b border-dashed border-slate-300 h-6"></div>
            </div>
            <div className="text-center space-y-1">
              <span className="text-slate-500">Ngày ...... tháng ...... năm 2026</span>
              <p className="font-semibold text-slate-700 pt-1">BÁC SĨ ĐIỀU TRỊ</p>
              <div className="h-14"></div>
              <p className="text-slate-400 italic text-[11px]">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
