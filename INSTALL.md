# Hướng Dẫn Cài Đặt & Chạy Ứng Dụng MedDecode

Tài liệu này hướng dẫn chi tiết các bước để cài đặt và khởi chạy ứng dụng **MedDecode** trên máy tính cá nhân.

---

## 1. Yêu Cầu Môi Trường

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
* **Node.js**: Phiên bản `18.0` trở lên (Khuyến nghị `Node.js 20 LTS` hoặc mới hơn).
  * Kiểm tra phiên bản bằng lệnh: `node -v`
* **npm** (đi kèm Node.js) hoặc **pnpm** / **yarn** / **bun**.
  * Kiểm tra phiên bản bằng lệnh: `npm -v`

---

## 2. Các Bước Cài Đặt

### Bước 1: Mở thư mục dự án
Mở cửa sổ dòng lệnh (Terminal / Command Prompt / PowerShell) và điều hướng đến thư mục gốc của dự án:
```bash
cd meddecode
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
Chạy lệnh sau để tải và cài đặt toàn bộ các thư viện cần thiết:
```bash
npm install
```
*(Hoặc dùng `bun install` nếu bạn sử dụng Bun)*

### Bước 3: Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
* Trên Linux / macOS:
  ```bash
  cp .env.example .env
  ```
* Trên Windows (PowerShell):
  ```powershell
  copy .env.example .env
  ```

*(Lưu ý: Ứng dụng đã được cấu hình sẵn kết nối Firebase Firestore trong file `firebase-applet-config.json` nên có thể chạy ngay mà không cần cấu hình thêm).*

---

## 3. Khởi Chạy Ứng Dụng

Sau khi hoàn tất cài đặt, chạy lệnh sau để khởi động máy chủ phát triển (Development Server):
```bash
npm run dev
```

Khi màn hình xuất hiện thông báo:
```text
  VITE v...  ready in ... ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

👉 Hãy mở trình duyệt web (Chrome, Edge, Firefox, Safari) và truy cập vào địa chỉ:
**`http://localhost:3000`**

---

## 4. Các Lệnh Hữu Ích Khác

| Lệnh | Công dụng |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ phát triển trên cổng `3000` |
| `npm run build` | Đóng gói sản phẩm tối ưu vào thư mục `dist/` |
| `npm run preview` | Chạy thử nghiệm bản đóng gói sản phẩm |
| `npm run lint` | Kiểm tra cú pháp và kiểu dữ liệu TypeScript (`tsc --noEmit`) |

---

## 5. Xử Lý Sự Cố Thường Gặp

* **Lỗi trùng cổng 3000 (Port 3000 is already in use)**:
  * Đóng tiến trình đang chiếm cổng 3000 hoặc chỉ định cổng khác:
    ```bash
    npx vite --port 3001
    ```
* **Lỗi thiếu gói thư viện (Module not found)**:
  * Xóa thư mục `node_modules` và cài đặt lại:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```
