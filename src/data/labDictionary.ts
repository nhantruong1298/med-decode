/**
 * @license
 * Thư viện 10 chỉ số xét nghiệm máu phổ biến phục vụ MedDecode .
 * Các khoảng tham chiếu mang tính minh họa cho thiết kế/kiểm thử, không phải giá trị y tế chính thức.
 */

export interface DemographicRange {
  min: number;
  max: number;
  text: string;
}

export interface UnitOption {
  donVi: string;
  heSo: number; // Tỉ lệ so với đơn vị chuẩn cơ sở (chia khi từ cơ sở -> đích)
  moTa: string;
}

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
  nhom: 'Huyết học' | 'Đường huyết & Chuyển hóa' | 'Chức năng Thận' | 'Chức năng Gan';
  coQuan: string;
  thamChieuNam: DemographicRange;
  thamChieuNu: DemographicRange;
  yeuToSinhLy: string[];
  cauHoiBacSi: string[];
  donViKhaDi?: UnitOption[];
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
    tenDayDu: 'Bạch cầu (White Blood Cells)',
    donVi: 'x10⁹/L',
    thamChieuMin: 4.0,
    thamChieuMax: 10.0,
    khoangThamChieuText: '4.0 – 10.0 x10⁹/L',
    nhom: 'Huyết học',
    coQuan: 'Hệ tạo máu & Miễn dịch',
    giaiThich: 'Bạch cầu là các tế bào miễn dịch bảo vệ cơ thể chống lại các tác nhân gây nhiễm khuẩn hoặc phản ứng viêm.',
    cachDoc: 'Số lượng bạch cầu phản ánh phản ứng bảo vệ của hệ miễn dịch. Chỉ số có thể biến đổi nhẹ sau khi vận động mạnh hoặc stress tạm thời.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 4.0, max: 10.0, text: '4.0 – 10.0 x10⁹/L' },
    thamChieuNu: { min: 4.0, max: 10.0, text: '4.0 – 10.0 x10⁹/L' },
    yeuToSinhLy: [
      'Vận động thể thao cường độ cao hoặc căng thẳng tâm lý có thể làm tăng tạm thời.',
      'Phụ nữ mang thai vào 3 tháng cuối thường có số lượng bạch cầu cao hơn bình thường.',
      'Hút thuốc lá kéo dài thường khiến bạch cầu nền duy trì ở mức cao.'
    ],
    cauHoiBacSi: [
      'Chỉ số bạch cầu của tôi có liên quan đến cảm cúm hoặc đợt viêm họng gần đây không?',
      'Tôi có cần làm thêm xét nghiệm công thức bạch cầu chi tiết (Neutrophil, Lymphocyte) không?',
      'Khi nào tôi nên làm lại xét nghiệm kiểm tra lại số lượng bạch cầu?'
    ],
    donViKhaDi: [
      { donVi: 'x10⁹/L', heSo: 1, moTa: 'Giga/L (chuẩn SI phổ biến tại BV Việt Nam)' },
      { donVi: 'tế bào/µL (mm³)', heSo: 1000, moTa: 'Đơn vị đếm tế bào vi thể' }
    ]
  },
  RBC: {
    ma: 'RBC',
    tenDayDu: 'Hồng cầu (Red Blood Cells)',
    donVi: 'x10¹²/L',
    thamChieuMin: 4.0,
    thamChieuMax: 5.8,
    khoangThamChieuText: '4.0 – 5.8 x10¹²/L',
    nhom: 'Huyết học',
    coQuan: 'Tủy xương & Hệ tuần hoàn',
    giaiThich: 'Hồng cầu vận chuyển oxy từ phổi đến các mô tế bào và mang khí carbonic về phổi để đào thải.',
    cachDoc: 'Số lượng hồng cầu hỗ trợ đánh giá khả năng vận chuyển oxy của máu trong các hoạt động sống hàng ngày.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 4.2, max: 5.8, text: '4.2 – 5.8 x10¹²/L' },
    thamChieuNu: { min: 4.0, max: 5.4, text: '4.0 – 5.4 x10¹²/L' },
    yeuToSinhLy: [
      'Mất nước (tiêu chảy, sốt, uống không đủ nước) làm máu cô đặc, gây tăng giả tạo hồng cầu.',
      'Sống ở vùng cao có nồng độ oxy loãng kích thích cơ thể sinh thêm hồng cầu.',
      'Phụ nữ trong chu kỳ kinh nguyệt hoặc mang thai có thể có lượng hồng cầu hơi thấp hơn.'
    ],
    cauHoiBacSi: [
      'Số lượng hồng cầu này có phản ánh tình trạng thiếu máu hay mất nước không?',
      'Chế độ ăn của tôi có cần bổ sung thêm sắt hoặc vitamin B12 không?',
      'Chỉ số này có cần đối chiếu thêm với HGB và Ferritin không?'
    ],
    donViKhaDi: [
      { donVi: 'x10¹²/L', heSo: 1, moTa: 'Tera/L (chuẩn SI)' },
      { donVi: 'triệu/µL', heSo: 1, moTa: 'Triệu tế bào trên microlit máu' }
    ]
  },
  HGB: {
    ma: 'HGB',
    tenDayDu: 'Huyết sắc tố (Hemoglobin - Hb)',
    donVi: 'g/L',
    thamChieuMin: 120,
    thamChieuMax: 170,
    khoangThamChieuText: '120 – 170 g/L',
    nhom: 'Huyết học',
    coQuan: 'Hồng cầu & Hệ tuần hoàn',
    giaiThich: 'Huyết sắc tố là protein giàu sắt trong hồng cầu, trực tiếp gắn kết và vận chuyển khí oxy trong hệ tuần hoàn.',
    cachDoc: 'Nồng độ huyết sắc tố là chỉ số cốt lõi giúp nhận biết tình trạng vận chuyển oxy và lượng sắt trong cơ thể.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 130, max: 175, text: '130 – 175 g/L (13 – 17.5 g/dL)' },
    thamChieuNu: { min: 120, max: 160, text: '120 – 160 g/L (12 – 16.0 g/dL)' },
    yeuToSinhLy: [
      'Uống ít nước trước khi lấy máu làm tăng nồng độ HGB trong huyết tương.',
      'Vận động viên bền bỉ có thể có huyết sắc tố thích nghi đặc thù.',
      'Chế độ ăn chay trường nếu không đủ sắt và B12 có thể làm giảm dần HGB.'
    ],
    cauHoiBacSi: [
      'Chỉ số HGB này có đảm bảo khả năng cung cấp oxy khi tôi tập luyện thể thao không?',
      'Tôi có cần kiểm tra thêm sắt huyết thanh không?',
      'Triệu chứng hoa mắt, chóng mặt gần đây có liên quan đến nồng độ huyết sắc tố này không?'
    ],
    donViKhaDi: [
      { donVi: 'g/L', heSo: 1, moTa: 'Gram trên lít (chuẩn BV Việt Nam)' },
      { donVi: 'g/dL', heSo: 0.1, moTa: 'Gram trên decilit (1 g/dL = 10 g/L)' }
    ]
  },
  HCT: {
    ma: 'HCT',
    tenDayDu: 'Dung tích hồng cầu (Hematocrit)',
    donVi: '%',
    thamChieuMin: 37,
    thamChieuMax: 50,
    khoangThamChieuText: '37 – 50 %',
    nhom: 'Huyết học',
    coQuan: 'Máu toàn phần',
    giaiThich: 'Tỷ lệ thể tích của hồng cầu chiếm trong tổng thể tích máu toàn phần.',
    cachDoc: 'Dung tích hồng cầu liên quan mật thiết đến số lượng hồng cầu và lượng nước trong cơ thể (tình trạng bù nước).',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 40, max: 50, text: '40 – 50 % (0.40 – 0.50 L/L)' },
    thamChieuNu: { min: 37, max: 46, text: '37 – 46 % (0.37 – 0.46 L/L)' },
    yeuToSinhLy: [
      'Mất nước qua mồ hôi sau vận động hoặc sốt làm tăng tạm thời % HCT.',
      'Uống lượng nước lớn ngay trước khi lấy mẫu có thể làm loãng máu nhẹ.',
      'Phụ nữ mang thai có thể giảm HCT do tăng thể tích huyết tương sinh lý.'
    ],
    cauHoiBacSi: [
      'Chỉ số HCT và HGB có đang đồng điệu với nhau trên phiếu của tôi không?',
      'Tôi có cần điều chỉnh thói quen uống nước hàng ngày không?'
    ]
  },
  PLT: {
    ma: 'PLT',
    tenDayDu: 'Tiểu cầu (Platelets)',
    donVi: 'x10⁹/L',
    thamChieuMin: 150,
    thamChieuMax: 400,
    khoangThamChieuText: '150 – 400 x10⁹/L',
    nhom: 'Huyết học',
    coQuan: 'Tủy xương & Quá trình đông cầm máu',
    giaiThich: 'Tiểu cầu là các mảnh tế bào nhỏ tham gia vào giai đoạn đầu của quá trình đông máu và làm lành vết thương.',
    cachDoc: 'Số lượng tiểu cầu đảm bảo sự cân bằng giữa khả năng cầm máu tự nhiên và duy trì lưu thông mạch máu.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 150, max: 400, text: '150 – 400 x10⁹/L' },
    thamChieuNu: { min: 150, max: 400, text: '150 – 400 x10⁹/L' },
    yeuToSinhLy: [
      'Tập luyện nặng ngay trước giờ xét nghiệm có thể làm tăng tạm thời tiểu cầu phóng thích từ lách.',
      'Sau giai đoạn hồi phục sau nhiễm virus (như sốt xuất huyết), tiểu cầu có thể tăng bù trừ tạm thời.',
      'Một số thuốc hạ nhiệt giảm đau (Aspirin, Ibuprofen) ảnh hưởng đến chức năng tiểu cầu.'
    ],
    cauHoiBacSi: [
      'Số lượng tiểu cầu này có an toàn cho các thủ thuật can thiệp (như nhổ răng, tiểu phẫu) không?',
      'Hiện tượng thâm tím nhẹ dưới da gần đây có liên quan đến chỉ số này không?'
    ]
  },
  GLU: {
    ma: 'GLU',
    tenDayDu: 'Glucose đói (Fasting Blood Sugar)',
    donVi: 'mmol/L',
    thamChieuMin: 3.9,
    thamChieuMax: 6.4,
    khoangThamChieuText: '3.9 – 6.4 mmol/L',
    nhom: 'Đường huyết & Chuyển hóa',
    coQuan: 'Tụy & Chuyển hóa carbohydrate',
    giaiThich: 'Nồng độ đường glucose hòa tan trong máu lúc nhịn ăn ít nhất 8 tiếng, nguồn năng lượng chính cho não và cơ bắp.',
    cachDoc: 'Được đo lúc đói buổi sáng để phản ánh khả năng điều hòa đường huyết tự nhiên của cơ thể.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 3.9, max: 6.4, text: '3.9 – 6.4 mmol/L (70 – 115 mg/dL)' },
    thamChieuNu: { min: 3.9, max: 6.4, text: '3.9 – 6.4 mmol/L (70 – 115 mg/dL)' },
    yeuToSinhLy: [
      'Ăn bữa ăn giàu tinh bột hoặc nước ngọt vào đêm muộn hôm trước có thể khiến đường huyết sáng hôm sau tăng nhẹ.',
      'Căng thẳng, mất ngủ hoặc lo lắng kích thích tuyến thượng thận tiết cortisol làm tăng đường huyết tức thì.',
      'Nhịn ăn kéo dài quá 16 tiếng có thể làm hạ đường huyết phản ứng nhẹ.'
    ],
    cauHoiBacSi: [
      'Tôi có cần làm thêm xét nghiệm HbA1c để theo dõi đường huyết trung bình 3 tháng qua không?',
      'Chỉ số này đã đủ tiêu chuẩn để tầm soát tiền đái tháo đường chưa?',
      'Tôi nên điều chỉnh chế độ ăn giảm đường bột như thế nào là phù hợp?'
    ],
    donViKhaDi: [
      { donVi: 'mmol/L', heSo: 1, moTa: 'Milimol trên lít (chuẩn BV Việt Nam)' },
      { donVi: 'mg/dL', heSo: 18.0182, moTa: 'Miligram trên decilit (1 mmol/L = 18.0182 mg/dL)' }
    ]
  },
  CHOL: {
    ma: 'CHOL',
    tenDayDu: 'Cholesterol toàn phần (Total Cholesterol)',
    donVi: 'mmol/L',
    thamChieuMin: 3.0,
    thamChieuMax: 5.2,
    khoangThamChieuText: '3.0 – 5.2 mmol/L',
    nhom: 'Đường huyết & Chuyển hóa',
    coQuan: 'Gan & Hệ tim mạch',
    giaiThich: 'Hợp chất chất béo thiết yếu để cấu tạo màng tế bào, tổng hợp hormone và vitamin D trong cơ thể.',
    cachDoc: 'Đo lường lượng lipid lưu hành trong máu, phản ánh chế độ dinh dưỡng và chuyển hóa chất béo chung.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 3.0, max: 5.2, text: '3.0 – 5.2 mmol/L (< 200 mg/dL)' },
    thamChieuNu: { min: 3.0, max: 5.2, text: '3.0 – 5.2 mmol/L (< 200 mg/dL)' },
    yeuToSinhLy: [
      'Chế độ ăn nhiều mỡ động vật, thức ăn nhanh trong vài tuần gần đây làm tăng nồng độ.',
      'Hút thuốc lá và ít vận động ảnh hưởng tiêu cực đến cán cân mỡ máu.',
      'Phụ nữ sau mãn kinh thường có xu hướng tăng nhẹ nồng độ cholesterol tự nhiên.'
    ],
    cauHoiBacSi: [
      'Tôi có cần làm bộ mỡ máu 4 thành phần (LDL-C, HDL-C, Triglyceride) chi tiết không?',
      'Với chỉ số này, tôi có cần dùng thuốc điều chỉnh mỡ máu hay chỉ cần thay đổi lối sống?',
      'Những nhóm thực phẩm nào tôi nên ưu tiên hoặc hạn chế?'
    ],
    donViKhaDi: [
      { donVi: 'mmol/L', heSo: 1, moTa: 'Milimol trên lít (chuẩn BV Việt Nam)' },
      { donVi: 'mg/dL', heSo: 38.67, moTa: 'Miligram trên decilit (1 mmol/L = 38.67 mg/dL)' }
    ]
  },
  CREA: {
    ma: 'CREA',
    tenDayDu: 'Creatinine',
    donVi: 'µmol/L',
    thamChieuMin: 62,
    thamChieuMax: 106,
    khoangThamChieuText: '62 – 106 µmol/L',
    nhom: 'Chức năng Thận',
    coQuan: 'Thận & Hoạt động cơ bắp',
    giaiThich: 'Sản phẩm thoái hóa tự nhiên từ hoạt động cơ bắp, được thận lọc và đào thải liên tục qua nước tiểu.',
    cachDoc: 'Phản ánh tốc độ đào thải chất chuyển hóa qua thận; mức bình thường có thể chênh lệch theo khối lượng cơ bắp cá nhân.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 62, max: 106, text: '62 – 106 µmol/L (0.7 – 1.2 mg/dL)' },
    thamChieuNu: { min: 44, max: 88, text: '44 – 88 µmol/L (0.5 – 1.0 mg/dL)' },
    yeuToSinhLy: [
      'Người tập gym thể hình có khối lượng cơ lớn thường có Creatinine nền cao hơn người ít vận động.',
      'Ăn nhiều thịt đỏ (thịt bò, thịt cừu) trước khi xét nghiệm có thể làm tăng nhẹ Creatinine.',
      'Tình trạng mất nước nặng làm giảm tạm thời lưu lượng máu đến thận khiến Creatinine tăng nhẹ thoáng qua.'
    ],
    cauHoiBacSi: [
      'Chỉ số Creatinine này tương ứng với mức lọc cầu thận ước tính (eGFR) là bao nhiêu?',
      'Khối lượng cơ bắp và chế độ tập luyện của tôi có ảnh hưởng đến kết quả này không?',
      'Tôi có cần kiểm tra thêm tổng phân tích nước tiểu không?'
    ],
    donViKhaDi: [
      { donVi: 'µmol/L', heSo: 1, moTa: 'Micromol trên lít (chuẩn BV Việt Nam)' },
      { donVi: 'mg/dL', heSo: 0.01131, moTa: 'Miligram trên decilit (1 mg/dL = 88.4 µmol/L)' }
    ]
  },
  AST: {
    ma: 'AST',
    tenDayDu: 'AST (Aspartate Aminotransferase / SGOT)',
    donVi: 'U/L',
    thamChieuMin: 5,
    thamChieuMax: 40,
    khoangThamChieuText: '5 – 40 U/L',
    nhom: 'Chức năng Gan',
    coQuan: 'Gan, Tim & Cơ bắp',
    giaiThich: 'Enzyme có mặt trong tế bào gan, cơ tim và cơ bắp, tham gia chuyển hóa acid amin.',
    cachDoc: 'Nồng độ enzyme phản ánh tính toàn vẹn của tế bào chuyển hóa tại gan và hệ vận động.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 5, max: 40, text: '5 – 40 U/L' },
    thamChieuNu: { min: 5, max: 35, text: '5 – 35 U/L' },
    yeuToSinhLy: [
      'Tập tạ nặng hoặc chạy bộ đường dài 24-48 giờ trước đó có thể làm tăng AST do giải phóng từ sợi cơ.',
      'Uống rượu bia đêm hôm trước gây căng thẳng chuyển hóa gan tạm thời.',
      'Một số loại thuốc giảm đau (Paracetamol), kháng sinh có thể làm men gan dao động.'
    ],
    cauHoiBacSi: [
      'Tỷ lệ AST/ALT trên kết quả của tôi có ý nghĩa thế nào?',
      'Các bài tập thể thao cường độ cao gần đây có góp phần làm tăng chỉ số này không?',
      'Tôi có cần làm siêu âm ổ bụng kiểm tra cấu trúc gan không?'
    ],
    donViKhaDi: [
      { donVi: 'U/L', heSo: 1, moTa: 'Đơn vị quốc tế trên lít (IU/L)' },
      { donVi: 'µkat/L', heSo: 0.0167, moTa: 'Microkatal trên lít (1 U/L = 0.0167 µkat/L)' }
    ]
  },
  ALT: {
    ma: 'ALT',
    tenDayDu: 'ALT (Alanine Aminotransferase / SGPT)',
    donVi: 'U/L',
    thamChieuMin: 5,
    thamChieuMax: 41,
    khoangThamChieuText: '5 – 41 U/L',
    nhom: 'Chức năng Gan',
    coQuan: 'Nhu mô tế bào Gan',
    giaiThich: 'Enzyme tập trung chủ yếu tại tế bào gan, liên quan trực tiếp đến hoạt động chuyển hóa năng lượng ở gan.',
    cachDoc: 'Thường được đánh giá song hành cùng AST để theo dõi quá trình làm việc tự nhiên của nhu mô gan.',
    nguonThamKhao: 'Tài liệu hướng dẫn đọc kết quả xét nghiệm tổng quát (Hướng dẫn Thực hành Xét nghiệm Lâm sàng - Bộ Y tế).',
    thamChieuNam: { min: 5, max: 41, text: '5 – 41 U/L' },
    thamChieuNu: { min: 5, max: 33, text: '5 – 33 U/L' },
    yeuToSinhLy: [
      'ALT có độ đặc hiệu với tế bào gan cao hơn AST; thường tăng khi gan phải làm việc quá tải do thức ăn dầu mỡ hoặc rượu bia.',
      'Thừa cân, tích mỡ nội tạng hoặc ít vận động là nguyên nhân phổ biến khiến ALT tăng nhẹ.',
      'Sử dụng các loại thuốc nam, thực phẩm chức năng không rõ nguồn gốc.'
    ],
    cauHoiBacSi: [
      'Nồng độ ALT này có phản ánh tình trạng gan nhiễm mỡ hay quá tải chuyển hóa không?',
      'Tôi có cần làm thêm xét nghiệm kháng thể viêm gan B, C không?',
      'Sau bao lâu tôi nên tái khám để kiểm tra lại men gan?'
    ],
    donViKhaDi: [
      { donVi: 'U/L', heSo: 1, moTa: 'Đơn vị quốc tế trên lít (IU/L)' },
      { donVi: 'µkat/L', heSo: 0.0167, moTa: 'Microkatal trên lít (1 U/L = 0.0167 µkat/L)' }
    ]
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
  
  // Dải hiển thị từ (min - range*0.6) đến (max + range*0.6)
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
 * Kịch bản mô phỏng nhận diện: Phiếu A (10/09/2026)
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
 * Phiếu B: 15/03/2026
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

/**
 * Dữ liệu mẫu 4 mốc thời gian trong năm 2026 dùng để trực quan hóa biểu đồ xu hướng (Longitudinal Trends)
 */
export const DU_LIEU_MAU_XU_HUONG_1_NAM: SavedReport[] = [
  {
    id: 'demo-report-q1',
    ngayXetNghiem: '2026-01-12',
    nhanPhieu: 'Khám định kỳ Q1 (12/01/2026)',
    chiSo: [
      { ma: 'WBC', giaTri: 8.4, donVi: 'x10⁹/L' },
      { ma: 'RBC', giaTri: 4.6, donVi: 'x10¹²/L' },
      { ma: 'HGB', giaTri: 139, donVi: 'g/L' },
      { ma: 'HCT', giaTri: 41, donVi: '%' },
      { ma: 'PLT', giaTri: 235, donVi: 'x10⁹/L' },
      { ma: 'GLU', giaTri: 6.2, donVi: 'mmol/L' },
      { ma: 'CHOL', giaTri: 5.8, donVi: 'mmol/L' },
      { ma: 'CREA', giaTri: 92, donVi: 'µmol/L' },
      { ma: 'AST', giaTri: 38, donVi: 'U/L' },
      { ma: 'ALT', giaTri: 44, donVi: 'U/L' },
    ]
  },
  {
    id: 'demo-report-q2',
    ngayXetNghiem: '2026-04-18',
    nhanPhieu: 'Tái khám Q2 (18/04/2026)',
    chiSo: [
      { ma: 'WBC', giaTri: 7.6, donVi: 'x10⁹/L' },
      { ma: 'RBC', giaTri: 4.7, donVi: 'x10¹²/L' },
      { ma: 'HGB', giaTri: 142, donVi: 'g/L' },
      { ma: 'HCT', giaTri: 42, donVi: '%' },
      { ma: 'PLT', giaTri: 248, donVi: 'x10⁹/L' },
      { ma: 'GLU', giaTri: 5.7, donVi: 'mmol/L' },
      { ma: 'CHOL', giaTri: 5.3, donVi: 'mmol/L' },
      { ma: 'CREA', giaTri: 88, donVi: 'µmol/L' },
      { ma: 'AST', giaTri: 32, donVi: 'U/L' },
      { ma: 'ALT', giaTri: 36, donVi: 'U/L' },
    ]
  },
  {
    id: 'demo-report-q3',
    ngayXetNghiem: '2026-07-22',
    nhanPhieu: 'Kiểm tra hè Q3 (22/07/2026)',
    chiSo: [
      { ma: 'WBC', giaTri: 6.9, donVi: 'x10⁹/L' },
      { ma: 'RBC', giaTri: 4.8, donVi: 'x10¹²/L' },
      { ma: 'HGB', giaTri: 146, donVi: 'g/L' },
      { ma: 'HCT', giaTri: 43, donVi: '%' },
      { ma: 'PLT', giaTri: 260, donVi: 'x10⁹/L' },
      { ma: 'GLU', giaTri: 5.3, donVi: 'mmol/L' },
      { ma: 'CHOL', giaTri: 5.0, donVi: 'mmol/L' },
      { ma: 'CREA', giaTri: 84, donVi: 'µmol/L' },
      { ma: 'AST', giaTri: 26, donVi: 'U/L' },
      { ma: 'ALT', giaTri: 29, donVi: 'U/L' },
    ]
  },
  {
    id: 'demo-report-q4',
    ngayXetNghiem: '2026-09-10',
    nhanPhieu: 'Đợt kiểm tra gần nhất (10/09/2026)',
    chiSo: [
      { ma: 'WBC', giaTri: 7.2, donVi: 'x10⁹/L' },
      { ma: 'RBC', giaTri: 4.8, donVi: 'x10¹²/L' },
      { ma: 'HGB', giaTri: 145, donVi: 'g/L' },
      { ma: 'HCT', giaTri: 42, donVi: '%' },
      { ma: 'PLT', giaTri: 250, donVi: 'x10⁹/L' },
      { ma: 'GLU', giaTri: 5.2, donVi: 'mmol/L' },
      { ma: 'CHOL', giaTri: 4.9, donVi: 'mmol/L' },
      { ma: 'CREA', giaTri: 82, donVi: 'µmol/L' },
      { ma: 'AST', giaTri: 28, donVi: 'U/L' },
      { ma: 'ALT', giaTri: 32, donVi: 'U/L' },
    ]
  }
];

/**
 * Cẩm nang chuẩn bị trước khi xét nghiệm máu (Pre-test Checklist)
 */
export interface PreTestGuideItem {
  id: string;
  tieuDe: string;
  chiTiet: string;
  tamQuanTrong: 'Bắt buộc' | 'Khuyến nghị' | 'Lưu ý';
  cacChiSoAnhHuong: string[];
}

export const CAM_NANG_CHUAN_BI: PreTestGuideItem[] = [
  {
    id: 'prep-fasting',
    tieuDe: 'Nhịn ăn từ 8 – 12 tiếng trước khi lấy mẫu',
    chiTiet: 'Không ăn thức ăn đặc, bánh kẹo, sữa hoặc nước ép. Nước lọc tinh khiết vẫn được uống bình thường. Thức ăn vừa nạp sẽ làm đường huyết và mỡ máu tăng cao đột ngột.',
    tamQuanTrong: 'Bắt buộc',
    cacChiSoAnhHuong: ['GLU (Đường huyết)', 'CHOL (Cholesterol toàn phần)']
  },
  {
    id: 'prep-water',
    tieuDe: 'Uống đủ nước lọc buổi sáng',
    chiTiet: 'Uống 1-2 ly nước lọc vào buổi sáng trước khi đến phòng khám. Cơ thể đủ nước giúp ven phồng dễ lấy máu và tránh hiện tượng máu bị cô đặc làm tăng giả số lượng hồng cầu, hematocrit.',
    tamQuanTrong: 'Khuyến nghị',
    cacChiSoAnhHuong: ['RBC (Hồng cầu)', 'HCT (Dung tích HC)', 'CREA (Creatinine)']
  },
  {
    id: 'prep-alcohol',
    tieuDe: 'Tránh rượu bia, cà phê và thuốc lá trong 24 giờ',
    chiTiet: 'Chất kích thích và cồn gây kích ứng gan tức thời, làm thay đổi thoáng qua nồng độ men gan và ảnh hưởng đến nhịp tim, huyết áp.',
    tamQuanTrong: 'Bắt buộc',
    cacChiSoAnhHuong: ['AST (Men gan)', 'ALT (Men gan)', 'GLU']
  },
  {
    id: 'prep-exercise',
    tieuDe: 'Tránh tập thể dục cường độ cao vào sáng lấy máu',
    chiTiet: 'Vận động thể thao mạnh (chạy nước rút, tập tạ nặng) làm giải phóng enzyme cơ bắp vào máu, khiến AST, ALT và Creatinine tăng tạm thời.',
    tamQuanTrong: 'Khuyến nghị',
    cacChiSoAnhHuong: ['AST', 'ALT', 'CREA', 'WBC']
  },
  {
    id: 'prep-medication',
    tieuDe: 'Chụp lại hoặc đem theo danh sách thuốc đang dùng',
    chiTiet: 'Không tự ý ngưng các thuốc tim mạch, huyết áp trừ khi có chỉ định riêng của bác sĩ. Hãy thông báo các thuốc đang uống (kháng sinh, giảm đau, vitamin C liều cao) cho người lấy mẫu.',
    tamQuanTrong: 'Lưu ý',
    cacChiSoAnhHuong: ['Tất cả 10 chỉ số']
  },
  {
    id: 'prep-rest',
    tieuDe: 'Nghỉ ngơi tĩnh tâm 10 – 15 phút tại phòng chờ',
    chiTiet: 'Ngồi thả lỏng trước khi cắm kim giúp hệ thần kinh ổn định, tránh co mạch và hạn chế tăng huyết áp hay tăng bạch cầu do căng thẳng.',
    tamQuanTrong: 'Khuyến nghị',
    cacChiSoAnhHuong: ['WBC (Bạch cầu)', 'GLU']
  }
];

/**
 * Cấu hình bộ chuyển đổi đơn vị xét nghiệm (Unit Converter Presets)
 */
export interface UnitConverterItem {
  id: string;
  tenChiSo: string;
  ma: string;
  donViA: string;
  donViB: string;
  heSoChuyenDoiA_sang_B: number; // formula: B = A * heSo
  congThucText: string;
  giaTriMauA: number;
  khoangChuanA: string;
  khoangChuanB: string;
  ghiChu: string;
}

export const DANH_SACH_BO_CHUYEN_DOI: UnitConverterItem[] = [
  {
    id: 'conv-glu',
    tenChiSo: 'Đường huyết đói (Glucose)',
    ma: 'GLU',
    donViA: 'mmol/L',
    donViB: 'mg/dL',
    heSoChuyenDoiA_sang_B: 18.0182,
    congThucText: 'mg/dL = mmol/L × 18.0182',
    giaTriMauA: 5.2,
    khoangChuanA: '3.9 – 6.4 mmol/L',
    khoangChuanB: '70 – 115 mg/dL',
    ghiChu: 'Các bệnh viện miền Bắc và miền Nam tại Việt Nam thường dùng mmol/L; máy đo cá nhân tại nhà thường dùng mg/dL.'
  },
  {
    id: 'conv-chol',
    tenChiSo: 'Cholesterol toàn phần',
    ma: 'CHOL',
    donViA: 'mmol/L',
    donViB: 'mg/dL',
    heSoChuyenDoiA_sang_B: 38.67,
    congThucText: 'mg/dL = mmol/L × 38.67',
    giaTriMauA: 4.8,
    khoangChuanA: '3.0 – 5.2 mmol/L',
    khoangChuanB: '116 – 200 mg/dL',
    ghiChu: 'Mức khuyến nghị cholesterol khỏe mạnh thường nằm dưới 200 mg/dL (tương đương 5.2 mmol/L).'
  },
  {
    id: 'conv-crea',
    tenChiSo: 'Creatinine',
    ma: 'CREA',
    donViA: 'µmol/L',
    donViB: 'mg/dL',
    heSoChuyenDoiA_sang_B: 0.01131,
    congThucText: 'mg/dL = µmol/L ÷ 88.4',
    giaTriMauA: 85,
    khoangChuanA: '62 – 106 µmol/L',
    khoangChuanB: '0.70 – 1.20 mg/dL',
    ghiChu: 'Tại Mỹ và một số tài liệu quốc tế dùng mg/dL; các phòng xét nghiệm tại Việt Nam đa số dùng µmol/L.'
  },
  {
    id: 'conv-hgb',
    tenChiSo: 'Huyết sắc tố (Hemoglobin)',
    ma: 'HGB',
    donViA: 'g/L',
    donViB: 'g/dL',
    heSoChuyenDoiA_sang_B: 0.1,
    congThucText: 'g/dL = g/L ÷ 10',
    giaTriMauA: 145,
    khoangChuanA: '120 – 170 g/L',
    khoangChuanB: '12.0 – 17.0 g/dL',
    ghiChu: 'Rất hay gặp tình trạng phiếu ghi g/dL khiến người xem tưởng bị tụt huyết sắc tố nghiêm trọng (ví dụ 14.5 g/dL so với 145 g/L).'
  }
];

/**
 * Hệ thống Hồ sơ Người dùng & Bệnh nhân (Local Authentication)
 */
export interface UserProfile {
  id: string;
  hoTen: string;
  namSinh: number;
  gioiTinh: 'Nam' | 'Nữ';
  nhomMau: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  soDienThoai: string;
  maHoSo: string;
  ghiChuSucKhoe?: string;
  avatarColor?: string;
}

export const DANH_SACH_HO_SO_MAC_DINH: UserProfile[] = [
  {
    id: 'user-1',
    hoTen: 'Nguyễn Văn A',
    namSinh: 1994,
    gioiTinh: 'Nam',
    nhomMau: 'O+',
    soDienThoai: '0912 345 678',
    maHoSo: 'BN-88421',
    ghiChuSucKhoe: 'Khám sức khỏe định kỳ hàng năm, huyết áp ổn định.',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'user-2',
    hoTen: 'Trần Thị Mai',
    namSinh: 1998,
    gioiTinh: 'Nữ',
    nhomMau: 'A+',
    soDienThoai: '0987 654 321',
    maHoSo: 'BN-88422',
    ghiChuSucKhoe: 'Theo dõi chỉ số huyết sắc tố (HGB) và mức năng lượng.',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'user-3',
    hoTen: 'Nguyễn Văn Hùng',
    namSinh: 1964,
    gioiTinh: 'Nam',
    nhomMau: 'B+',
    soDienThoai: '0903 112 233',
    maHoSo: 'BN-88423',
    ghiChuSucKhoe: 'Tiền sử tăng mỡ máu nhẹ, theo dõi đường huyết và creatinine 3 tháng/lần.',
    avatarColor: 'bg-indigo-600',
  },
];

/**
 * Đánh giá Thể trạng BMI & Nguy cơ Chuyển hóa
 */
export interface BmiEvaluation {
  bmi: number;
  phanLoai: string;
  khuyenNghi: string;
  mauSac: string;
}

export function tinhChiSoBMI(chieuCaoCm: number, canNangKg: number): BmiEvaluation {
  if (!chieuCaoCm || !canNangKg || chieuCaoCm <= 0 || canNangKg <= 0) {
    return {
      bmi: 0,
      phanLoai: 'Chưa đủ dữ liệu',
      khuyenNghi: 'Vui lòng nhập chiều cao và cân nặng hợp lệ.',
      mauSac: 'text-slate-500'
    };
  }
  const chieuCaoMet = chieuCaoCm / 100;
  const bmi = Number((canNangKg / (chieuCaoMet * chieuCaoMet)).toFixed(1));

  // Tiêu chuẩn WHO khu vực châu Á - Thái Bình Dương (WPRO)
  if (bmi < 18.5) {
    return {
      bmi,
      phanLoai: 'Thiếu cân (Gầy)',
      khuyenNghi: 'Cần bổ sung dinh dưỡng cân bằng giàu protein, kiểm tra thêm hồng cầu (RBC) và huyết sắc tố (HGB).',
      mauSac: 'text-amber-700'
    };
  } else if (bmi <= 22.9) {
    return {
      bmi,
      phanLoai: 'Thể trạng cân đối (Lý tưởng)',
      khuyenNghi: 'Chỉ số thể trạng đạt chuẩn khuyến nghị của WHO. Duy trì lối sống lành mạnh và vận động thể lực thường xuyên.',
      mauSac: 'text-emerald-700'
    };
  } else if (bmi <= 24.9) {
    return {
      bmi,
      phanLoai: 'Tiền béo phì (Thừa cân)',
      khuyenNghi: 'Nên kiểm soát lượng đường bột, theo dõi định kỳ Glucose đói (GLU) và Cholesterol toàn phần (CHOL).',
      mauSac: 'text-amber-800'
    };
  } else {
    return {
      bmi,
      phanLoai: 'Béo phì',
      khuyenNghi: 'Cần lưu ý theo dõi men gan (AST, ALT), mỡ máu và huyết áp cùng bác sĩ chuyên khoa để phòng ngừa gan nhiễm mỡ.',
      mauSac: 'text-rose-700'
    };
  }
}

