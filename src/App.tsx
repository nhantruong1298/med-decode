import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header, Footer } from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import VerifyScreen from './screens/VerifyScreen';
import DashboardScreen from './screens/DashboardScreen';
import IndicatorDetailScreen from './screens/IndicatorDetailScreen';
import HistoryScreen from './screens/HistoryScreen';
import CompareScreen from './screens/CompareScreen';
import TrendsScreen from './screens/TrendsScreen';
import DictionaryScreen from './screens/DictionaryScreen';
import ToolsScreen from './screens/ToolsScreen';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-['Be_Vietnam_Pro',sans-serif]">
          {/* Header chung */}
          <Header />

          {/* Các màn hình theo đặc tả & mở rộng tiện ích y khoa */}
          <main className="flex-1 pb-12">
            <Routes>
              {/* 1. Trang chủ */}
              <Route path="/" element={<HomeScreen />} />

              {/* 2. Tải / chụp phiếu */}
              <Route path="/upload" element={<UploadScreen />} />

              {/* 3. Kiểm tra thông tin */}
              <Route path="/verify" element={<VerifyScreen />} />

              {/* 4. Dashboard kết quả */}
              <Route path="/dashboard" element={<DashboardScreen />} />

              {/* 5. Chi tiết chỉ số */}
              <Route path="/indicator/:code" element={<IndicatorDetailScreen />} />

              {/* 6. Lịch sử xét nghiệm */}
              <Route path="/history" element={<HistoryScreen />} />

              {/* 7. So sánh kết quả */}
              <Route path="/compare" element={<CompareScreen />} />

              {/* 8. Mở rộng: Xu hướng biến thiên thời gian thực */}
              <Route path="/trends" element={<TrendsScreen />} />

              {/* 9. Mở rộng: Bách khoa tra cứu 10 chỉ số */}
              <Route path="/dictionary" element={<DictionaryScreen />} />

              {/* 10. Mở rộng: Bộ công cụ đổi đơn vị & Cẩm nang chuẩn bị */}
              <Route path="/tools" element={<ToolsScreen />} />

              {/* Điều hướng mặc định */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer thông tin học thuật */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
