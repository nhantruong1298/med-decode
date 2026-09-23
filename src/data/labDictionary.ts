/**
 * @license
 * Thư viện 10 chỉ số xét nghiệm máu phổ biến phục vụ MedDecode (đồ án học thuật UI/UX).
 * Các khoảng tham chiếu mang tính minh họa cho thiết kế/kiểm thử, không phải giá trị y tế chính thức.
 */

export interface ChiSoDefinition {
  ma: string;
  tenDayDu: string;
  donVi: string;
  thamChieuMin: number;
  thamChieuMax: number;
  khoangThamChieuText: string;
  giaiThich: string;
  cachDoc: string;
  nguonThamKhao: string;
}

export type StatusType = 
  | 'Trong khoảng tham chiếu' 
  | 'Thấp hơn' 
  | 'Cao hơn' 
  | 'Chưa đủ thông tin';

export interface ChiSoItem {
  ma: string;
  giaTri: number | null | string;
  donVi: string;
}

export interface SavedReport {
  id?: string;
  ngayXetNghiem: string; // yyyy-mm-dd
  nhanPhieu: string;
  chiSo: ChiSoItem[];
  createdAt?: any;
}

export const THU_VIEN_CHI_SO: Record<string, ChiSoDefinition> = {
  WBC: {
    ma: 'WBC',
    tenDayDu: 'Bạch cầu',
    donVi: 'x10⁹/L',
    thamChieuMin: 4.0,
    thamChieuMax: 10.0,
    khoangThamChieuText: '4.0 – 10.0 x10⁹/L',
    giaiThich: 'Bạch cầu là các tế bào miễn dịch bảo vệ cơ thể chống lại các tác nhân gây nhiễm khuẩn hoặc phản ứng viêm.',
    cachDoc: 'Số lượng bạch cầu phản ánh phản ứng bảo vệ của hệ miễn dịch. Chỉ số có thể biến đổi nhẹ sau khi vận động mạnh hoặc stress tạm thời.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  RBC: {
    ma: 'RBC',
    tenDayDu: 'Hồng cầu',
    donVi: 'x10¹²/L',
    thamChieuMin: 4.0,
    thamChieuMax: 5.8,
    khoangThamChieuText: '4.0 – 5.8 x10¹²/L',
    giaiThich: 'Hồng cầu vận chuyển oxy từ phổi đến các mô tế bào và mang khí carbonic về phổi để đào thải.',
    cachDoc: 'Số lượng hồng cầu hỗ trợ đánh giá khả năng vận chuyển oxy của máu trong các hoạt động sống hàng ngày.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  HGB: {
    ma: 'HGB',
    tenDayDu: 'Huyết sắc tố (Hb)',
    donVi: 'g/L',
    thamChieuMin: 120,
    thamChieuMax: 170,
    khoangThamChieuText: '120 – 170 g/L',
    giaiThich: 'Huyết sắc tố là protein giàu sắt trong hồng cầu, trực tiếp gắn kết và vận chuyển khí oxy trong hệ tuần hoàn.',
    cachDoc: 'Nồng độ huyết sắc tố là chỉ số cốt lõi giúp nhận biết tình trạng vận chuyển oxy và lượng sắt trong cơ thể.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  HCT: {
    ma: 'HCT',
    tenDayDu: 'Dung tích hồng cầu',
    donVi: '%',
    thamChieuMin: 37,
    thamChieuMax: 50,
    khoangThamChieuText: '37 – 50 %',
    giaiThich: 'Tỷ lệ thể tích của hồng cầu chiếm trong tổng thể tích máu toàn phần.',
    cachDoc: 'Dung tích hồng cầu liên quan mật thiết đến số lượng hồng cầu và lượng nước trong cơ thể (tình trạng bù nước).',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  PLT: {
    ma: 'PLT',
    tenDayDu: 'Tiểu cầu',
    donVi: 'x10⁹/L',
    thamChieuMin: 150,
    thamChieuMax: 400,
    khoangThamChieuText: '150 – 400 x10⁹/L',
    giaiThich: 'Tiểu cầu là các mảnh tế bào nhỏ tham gia vào giai đoạn đầu của quá trình đông máu và làm lành vết thương.',
    cachDoc: 'Số lượng tiểu cầu đảm bảo sự cân bằng giữa khả năng cầm máu tự nhiên và duy trì lưu thông mạch máu.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  GLU: {
    ma: 'GLU',
    tenDayDu: 'Glucose (đường huyết đói)',
    donVi: 'mmol/L',
    thamChieuMin: 3.9,
    thamChieuMax: 6.4,
    khoangThamChieuText: '3.9 – 6.4 mmol/L',
    giaiThich: 'Nồng độ đường glucose hòa tan trong máu lúc nhịn ăn ít nhất 8 tiếng, nguồn năng lượng chính cho não và cơ bắp.',
    cachDoc: 'Được đo lúc đói buổi sáng để phản ánh khả năng điều hòa đường huyết tự nhiên của cơ thể.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  CHOL: {
    ma: 'CHOL',
    tenDayDu: 'Cholesterol toàn phần',
    donVi: 'mmol/L',
    thamChieuMin: 3.0,
    thamChieuMax: 5.2,
    khoangThamChieuText: '3.0 – 5.2 mmol/L',
    giaiThich: 'Hợp chất chất béo thiết yếu để cấu tạo màng tế bào, tổng hợp hormone và vitamin D trong cơ thể.',
    cachDoc: 'Đo lường lượng lipid lưu hành trong máu, phản ánh chế độ dinh dưỡng và chuyển hóa chất béo chung.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  CREA: {
    ma: 'CREA',
    tenDayDu: 'Creatinine',
    donVi: 'µmol/L',
    thamChieuMin: 62,
    thamChieuMax: 106,
    khoangThamChieuText: '62 – 106 µmol/L',
    giaiThich: 'Sản phẩm thoái hóa tự nhiên từ hoạt động cơ bắp, được thận lọc và đào thải liên tục qua nước tiểu.',
    cachDoc: 'Phản ánh tốc độ đào thải chất chuyển hóa qua thận; mức bình thường có thể chênh lệch theo khối lượng cơ bắp cá nhân.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  AST: {
    ma: 'AST',
    tenDayDu: 'AST (SGOT)',
    donVi: 'U/L',
    thamChieuMin: 5,
    thamChieuMax: 40,
    khoangThamChieuText: '5 – 40 U/L',
    giaiThich: 'Enzyme có mặt trong tế bào gan, cơ tim và cơ bắp, tham gia chuyển hóa acid amin.',
    cachDoc: 'Nồng độ enzyme phản ánh tính toàn vẹn của tế bào chuyển hóa tại gan và hệ vận động.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  },
  ALT: {
    ma: 'ALT',
    tenDayDu: 'ALT (SGPT)',
    donVi: 'U/L',
    thamChieuMin: 5,
    thamChieuMax: 41,
    khoangThamChieuText: '5 – 41 U/L',
    giaiThich: 'Enzyme tập trung chủ yếu tại tế bào gan, liên quan trực tiếp đến hoạt động chuyển hóa năng lượng ở gan.',
    cachDoc: 'Thường được đánh giá song hành cùng AST để theo dõi quá trình làm việc tự nhiên của nhu mô gan.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Tài liệu minh họa phục vụ đồ án UI/UX).'
  }
};

export const DANH_SACH_MA_CHI_SO = ['WBC', 'RBC', 'HGB', 'HCT', 'PLT', 'GLU', 'CHOL', 'CREA', 'AST', 'ALT'];

/**
 * Tính trạng thái chỉ số từ giá trị và khoảng tham chiếu
 */
export function tinhTrangThaiChiSo(giaTri: number | null | string | undefined, ma: string): StatusType {
  if (giaTri === null || giaTri === undefined || giaTri === '') {
    return 'Chưa đủ thông tin';
  }
  const val = typeof giaTri === 'number' ? giaTri : parseFloat(String(giaTri));
  if (isNaN(val)) {
    return 'Chưa đủ thông tin';
  }
  const def = THU_VIEN_CHI_SO[ma];
  if (!def) {
    return 'Chưa đủ thông tin';
  }
  if (val < def.thamChieuMin) {
    return 'Thấp hơn';
  }
  if (val > def.thamChieuMax) {
    return 'Cao hơn';
  }
  return 'Trong khoảng tham chiếu';
}

/**
 * Tính phần trăm tỷ lệ trên thanh đo trực quan (0% đến 100%)
 * Giúp biểu diễn trực quan vị trí giá trị so với dải [min, max]
 */
export function tinhPhanTramThanhDo(giaTri: number | null | string | undefined, ma: string): {
  ratioPercent: number;
  minPercent: number;
  maxPercent: number;
} {
  const def = THU_VIEN_CHI_SO[ma];
  if (!def) return { ratioPercent: 50, minPercent: 30, maxPercent: 70 };

  const min = def.thamChieuMin;
  const max = def.thamChieuMax;
  const range = max - min;
  
  // Dải hiển thị từ (min - range*0.5) đến (max + range*0.5)
  const displayMin = Math.max(0, min - range * 0.6);
  const displayMax = max + range * 0.6;
  const totalSpan = displayMax - displayMin;

  const minPercent = ((min - displayMin) / totalSpan) * 100;
  const maxPercent = ((max - displayMin) / totalSpan) * 100;

  if (giaTri === null || giaTri === undefined || giaTri === '' || isNaN(Number(giaTri))) {
    return { ratioPercent: 50, minPercent, maxPercent };
  }

  const val = Number(giaTri);
  const clampedVal = Math.min(Math.max(val, displayMin), displayMax);
  const ratioPercent = ((clampedVal - displayMin) / totalSpan) * 100;

  return { ratioPercent, minPercent, maxPercent };
}

/**
 * Kịch bản mô phỏng nhận diện:
 * Phiếu A: 10/09/2026: Đủ 10 chỉ số, trong đó CHOL bị nhận diện sai (6.1 thay vì 5.1 trong ảnh)
 * và CREA bị thiếu (trống).
 */
export const KICH_BAN_PHIEU_A: {
  ngayXetNghiem: string;
  nhanPhieu: string;
  chiSo: ChiSoItem[];
  ghiChuLoi: { [ma: string]: string };
} = {
  ngayXetNghiem: '2026-09-10',
  nhanPhieu: 'Phiếu xét nghiệm 10/09/2026',
  chiSo: [
    { ma: 'WBC', giaTri: 7.2, donVi: 'x10⁹/L' },
    { ma: 'RBC', giaTri: 4.8, donVi: 'x10¹²/L' },
    { ma: 'HGB', giaTri: 145, donVi: 'g/L' },
    { ma: 'HCT', giaTri: 42, donVi: '%' },
    { ma: 'PLT', giaTri: 250, donVi: 'x10⁹/L' },
    { ma: 'GLU', giaTri: 5.2, donVi: 'mmol/L' },
    { ma: 'CHOL', giaTri: 6.1, donVi: 'mmol/L' }, // Cố tình nhận diện sai (ảnh gốc là 5.1)
    { ma: 'CREA', giaTri: '', donVi: 'µmol/L' }, // Cố tình thiếu để người dùng bổ sung
    { ma: 'AST', giaTri: 28, donVi: 'U/L' },
    { ma: 'ALT', giaTri: 32, donVi: 'U/L' },
  ],
  ghiChuLoi: {
    CHOL: 'Chỉ số Cholesterol có thể nhận diện chưa chuẩn xác so với phiếu gốc (ảnh ghi 5.1). Vui lòng đối chiếu.',
    CREA: 'Chưa có Creatinine. Vui lòng kiểm tra và bổ sung từ phiếu xét nghiệm.'
  }
};

/**
 * Phiếu B: 15/03/2026: Đủ 10 chỉ số, dùng để seed tự động vào Firestore khi rỗng
 */
export const KICH_BAN_PHIEU_B: SavedReport = {
  ngayXetNghiem: '2026-03-15',
  nhanPhieu: 'Phiếu xét nghiệm 15/03/2026',
  chiSo: [
    { ma: 'WBC', giaTri: 6.5, donVi: 'x10⁹/L' },
    { ma: 'RBC', giaTri: 4.5, donVi: 'x10¹²/L' },
    { ma: 'HGB', giaTri: 138, donVi: 'g/L' },
    { ma: 'HCT', giaTri: 40, donVi: '%' },
    { ma: 'PLT', giaTri: 220, donVi: 'x10⁹/L' },
    { ma: 'GLU', giaTri: 5.6, donVi: 'mmol/L' },
    { ma: 'CHOL', giaTri: 4.8, donVi: 'mmol/L' },
    { ma: 'CREA', giaTri: 85, donVi: 'µmol/L' },
    { ma: 'AST', giaTri: 24, donVi: 'U/L' },
    { ma: 'ALT', giaTri: 26, donVi: 'U/L' },
  ]
};
