import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reset cuộn trang về đầu mỗi khi chuyển route, vì React Router mặc định giữ nguyên vị trí cuộn cũ
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
