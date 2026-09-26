# MedDecode - Hệ Thống Đọc Hiểu & Theo Dõi Kết Quả Xét Nghiệm Máu

**MedDecode** là ứng dụng web hỗ trợ người dùng đọc hiểu, kiểm tra và theo dõi các chỉ số xét nghiệm máu một cách khoa học, an toàn và trung tính. Ứng dụng tuân thủ nguyên tắc không chẩn đoán bệnh, giúp người dùng nắm rõ các dải tham chiếu sinh lý để chuẩn bị câu hỏi trao đổi cùng bác sĩ.

---

## Các Chức Năng Chính

### 1. Cổng Quản Lý & Tìm Kiếm Hồ Sơ Bệnh Nhân (`/`)
* Khi vào ứng dụng, giao diện chính hiển thị danh sách toàn bộ hồ sơ bệnh nhân.
* Tìm kiếm tức thời hồ sơ theo họ tên, số điện thoại, mã hồ sơ hoặc nhóm máu; lọc theo giới tính hoặc hồ sơ đã có kết quả.
* Tạo mới hồ sơ bệnh nhân (Họ tên, năm sinh, giới tính, nhóm máu, số điện thoại, tiền sử sức khỏe) và đồng bộ lưu trữ vào Cloud Firestore & thiết bị.
* Khi mở chi tiết hồ sơ bệnh nhân, người dùng được cung cấp 2 hành động trọng tâm: **Chọn ảnh xét nghiệm (Quét AI)** hoặc **Xem lịch sử kết quả xét nghiệm**.

### 2. Đọc & Quét Phiếu Xét Nghiệm Bằng AI (`/upload`)
* Hỗ trợ tải tệp ảnh phiếu xét nghiệm (PNG, JPG, JPEG, WebP) từ thiết bị.
* Tích hợp AI (Google Gemini 3.8 Flash) quét trực tiếp hình ảnh, tự động nhận diện chữ, ngày tháng lấy mẫu và bảng chỉ số y khoa gắn với hồ sơ bệnh nhân đang chọn.
* Tự động bóc tách số liệu đưa vào biểu mẫu đối chiếu; phát hiện và thông báo nếu có số liệu bị mờ hoặc không rõ nét.

### 3. Đối Chiếu Hai Màn Hình (`/verify`)
* Đặt ảnh gốc (phóng to/thu nhỏ) song song cạnh biểu mẫu nhập liệu.
* Cho phép chỉnh sửa từng trường số liệu, tự động cảnh báo các ô thiếu dữ liệu hoặc giá trị bất thường.

### 3. Bảng Kết Quả Trực Quan (`/dashboard`)
* Hiển thị đầy đủ 10 chỉ số xét nghiệm máu phổ biến (WBC, RBC, HGB, HCT, PLT, GLU, CHOL, CREA, AST, ALT).
* Thước đo trực quan thể hiện giá trị so với dải tham chiếu an toàn.
* Phân loại 4 trạng thái trung tính: *Trong khoảng tham chiếu*, *Cao hơn*, *Thấp hơn*, *Chưa đủ thông tin*.
* Bộ lọc theo hệ cơ quan (Huyết học, Đường huyết, Mỡ máu, Thận, Gan).

### 4. Chi Tiết Chỉ Số & Khoảng Chuẩn Giới Tính (`/indicator/:code`)
* Giải thích ý nghĩa sinh lý và cách tiếp cận kết quả bằng ngôn ngữ dễ hiểu.
* Bảng tham chiếu chi tiết riêng biệt cho Nam giới và Nữ giới.
* Tổng hợp các yếu tố sinh lý thông thường có thể làm thay đổi chỉ số (uống ít nước, ăn tối muộn, tập gym).
* Gợi ý câu hỏi nên trao đổi trực tiếp với bác sĩ khi đi tái khám.

### 5. Lịch Sử & So Sánh Đối Chiếu (`/history`, `/compare`)
* Lưu trữ và đọc dữ liệu xét nghiệm trực tiếp từ Google Cloud Firestore.
* Tích chọn 2 phiếu bất kỳ để mở màn hình đối chiếu số liệu theo từng chỉ số.

### 6. Biểu Đồ Xu Hướng Biến Thiên (`/trends`)
* Theo dõi diễn tiến tăng/giảm của từng chỉ số qua các mốc thời gian.
* Biểu đồ đường SVG trực quan kèm dải hành lang an toàn (Safe Corridor).
* Thống kê độ lệch ($\Delta$), phần trăm tăng giảm và nhận định xu hướng sinh lý.
* Hỗ trợ chuyển đổi giữa dữ liệu Firestore và dữ liệu mẫu theo dõi 1 năm.

### 7. Bách Khoa Tra Cứu 10 Chỉ Số (`/dictionary`)
* Thư viện bách khoa tìm kiếm tức thì theo mã viết tắt, tên tiếng Việt hoặc cơ quan.
* Bộ lọc theo nhóm chuyên môn kèm khoảng chuẩn chi tiết.

### 8. Bộ Công Cụ Y Khoa Hữu Ích (`/tools`)
* **Đổi đơn vị xét nghiệm**: Quy đổi 2 chiều giữa $\text{mmol/L} \leftrightarrow \text{mg/dL}$ (Glucose, Cholesterol), $\mu\text{mol/L} \leftrightarrow \text{mg/dL}$ (Creatinine), $\text{g/L} \leftrightarrow \text{g/dL}$ (Hb).
* **Tính thể trạng BMI**: Đánh giá chỉ số khối cơ thể theo chuẩn WHO châu Á (WPRO) kèm lời khuyên dinh dưỡng.
* **Cẩm nang trước khi lấy máu**: Checklist tương tác 6 bước chuẩn bị (nhịn ăn, uống nước, kiêng chất kích thích).

### 9. Quản Lý Hồ Sơ Bệnh Nhân Cục Bộ (Local Auth)
* Quản lý nhiều hồ sơ bệnh nhân trên cùng trình duyệt (lưu tại `localStorage`).
* Đổi nhanh tài khoản 1 chạm (Nguyễn Văn A, Trần Thị Mai, Nguyễn Văn Hùng...).
* Thêm mới hồ sơ bệnh nhân kèm nhóm máu, năm sinh, số điện thoại.
* Tự động đồng bộ thông tin bệnh nhân đang chọn lên phiếu xét nghiệm và bản in.

### 10. Xuất Bản In & Phiếu Tóm Tắt Y Khoa (Print / PDF)
* Modal xem trước bản in theo chuẩn hồ sơ y tế: có mã bệnh nhân, mã QR xác thực số, bảng 10 chỉ số phân nhóm và ô chữ ký bác sĩ.
* Hỗ trợ lệnh in trực tiếp (`window.print()`) được tối ưu giao diện in ấn sạch đẹp.

---

## Ngăn Xếp Công Nghệ (Tech Stack)

* **Giao diện**: React 19, Vite, TypeScript.
* **Xử lý AI Backend**: Google GenAI SDK (`@google/genai` với mô hình `gemini-3.8-flash`), Express Node.js.
* **Định kiểu (Styling)**: Tailwind CSS v4, Google Fonts (*Be Vietnam Pro*).
* **Biểu tượng (Icons)**: Lucide React.
* **Cơ sở dữ liệu**: Google Cloud Firestore (Firebase Web SDK).
* **Lưu trữ phiên & hồ sơ**: LocalStorage & React Context API.
