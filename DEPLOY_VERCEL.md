# Hướng Dẫn Deploy Ứng Dụng Lên Vercel

Ứng dụng **MedDecode** đã được cấu hình sẵn sàng cho **Vercel** gồm:
1. `vercel.json`: Tự động điều hướng frontend (SPA) và backend serverless function `/api/scan-report`.
2. `api/scan-report.ts`: API bóc tách phiếu xét nghiệm bằng Gemini AI chạy dạng Vercel Serverless Function.
3. `src/firebase.ts`: Tự động nhận biến môi trường trên Vercel hoặc file cấu hình Firebase có sẵn.

---

## 1. Danh sách Secret Keys & Biến Môi Trường (Environment Variables)

Khi tạo dự án trên Vercel (hoặc vào **Settings** > **Environment Variables**), hãy cấu hình các biến sau:

### Biến bắt buộc cho AI:
| Tên Biến | Ý nghĩa | Giá trị mẫu / Hướng dẫn |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Khóa API Google Gemini AI để đọc phiếu xét nghiệm | Lấy miễn phí tại: https://aistudio.google.com/app/apikey |

### Biến cơ sở dữ liệu Firebase Firestore:
> Lưu ý: Mã nguồn đã có sẵn file `firebase-applet-config.json`. Nếu bạn commit file này lên GitHub, các biến dưới đây là **tùy chọn** (đã tự nhận). Nếu bạn muốn bảo mật bằng Environment Variables trên Vercel, hãy nhập các giá trị sau:

```env
VITE_FIREBASE_PROJECT_ID=ai-study-roadmap
VITE_FIREBASE_APP_ID=1:949225463603:web:d495e193d16bab98f9e846
VITE_FIREBASE_API_KEY=AIzaSyCj6i_j0bRE9yuGLrbzVL3GM7q4rYCS-N0
VITE_FIREBASE_AUTH_DOMAIN=ai-study-roadmap.firebaseapp.com
VITE_FIREBASE_DATABASE_ID=ai-studio-6afacbb8-51e4-4f7a-9558-e37b317d8cdd
VITE_FIREBASE_STORAGE_BUCKET=ai-study-roadmap.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=949225463603
```

---

## 2. Các Bước Deploy Lên Vercel

### Cách 1: Deploy qua GitHub (Khuyên dùng - Tiện lợi nhất)
1. Đẩy (Push) toàn bộ mã nguồn lên một Repository trên GitHub của bạn.
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập.
3. Nhấn **"Add New..."** -> **"Project"**.
4. Chọn kho lưu trữ GitHub của dự án vừa push.
5. Tại mục **Configure Project**:
   - **Framework Preset**: Chọn `Vite` (Vercel sẽ tự động nhận diện).
   - **Root Directory**: Để trống `./`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Mở rộng mục **Environment Variables** và điền:
   - `GEMINI_API_KEY`: Khóa Gemini API của bạn.
   - (Tùy chọn) Các biến `VITE_FIREBASE_*` ở trên.
7. Nhấn **Deploy**. Đợi 1-2 phút là website của bạn sẽ hoạt động hoàn tất!

---

### Cách 2: Deploy trực tiếp bằng Vercel CLI (Từ dòng lệnh)
1. Cài đặt Vercel CLI nếu chưa có:
   ```bash
   npm i -g vercel
   ```
2. Đăng nhập tài khoản Vercel:
   ```bash
   vercel login
   ```
3. Chạy lệnh deploy:
   ```bash
   vercel
   ```
4. Khi triển khai lên môi trường chính thức (Production):
   ```bash
   vercel --prod
   ```
5. Thêm biến môi trường trên Vercel CLI:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
