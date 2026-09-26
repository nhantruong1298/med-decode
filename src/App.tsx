import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer } from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import VerifyScreen from './screens/VerifyScreen';
import DashboardScreen from './screens/DashboardScreen';
import IndicatorDetailScreen from './screens/IndicatorDetailScreen';
import HistoryScreen from './screens/HistoryScreen';
import CompareScreen from './screens/CompareScreen';
import TrendsScreen from './screens/TrendsScreen';

// Component bảo vệ: Bắt buộc phải chọn hồ sơ bệnh nhân trước khi vào các mục xét nghiệm
const PatientRequiredRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-['Be_Vietnam_Pro',sans-serif]">
          {/* Header chung */}
          <Header />

          {/* Các màn hình theo luồng nghiệp vụ */}
          <main className="flex-1 pb-12">
            <Routes>
              {/* 1. Trang chủ: Danh sách hồ sơ bệnh nhân */}
              <Route path="/" element={<HomeScreen />} />

              {/* 2. Đọc phiếu xét nghiệm bằng AI (Chỉ khi đã chọn hồ sơ) */}
              <Route
                path="/upload"
                element={
                  <PatientRequiredRoute>
                    <UploadScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 3. Kiểm tra thông tin & đối chiếu ảnh */}
              <Route
                path="/verify"
                element={
                  <PatientRequiredRoute>
                    <VerifyScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 4. Dashboard kết quả 10 chỉ số */}
              <Route
                path="/dashboard"
                element={
                  <PatientRequiredRoute>
                    <DashboardScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 5. Chi tiết chỉ số */}
              <Route
                path="/indicator/:code"
                element={
                  <PatientRequiredRoute>
                    <IndicatorDetailScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 6. Lịch sử xét nghiệm */}
              <Route
                path="/history"
                element={
                  <PatientRequiredRoute>
                    <HistoryScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 7. So sánh kết quả giữa 2 phiếu */}
              <Route
                path="/compare"
                element={
                  <PatientRequiredRoute>
                    <CompareScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* 8. Xu hướng biến thiên chỉ số qua các mốc thời gian */}
              <Route
                path="/trends"
                element={
                  <PatientRequiredRoute>
                    <TrendsScreen />
                  </PatientRequiredRoute>
                }
              />

              {/* Điều hướng mặc định: Mọi đường dẫn lạ chuyển về trang chủ */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer thông tin */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
