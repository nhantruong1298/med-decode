import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  SavedReport,
  ChiSoItem,
  KICH_BAN_PHIEU_B,
  UserProfile,
  DANH_SACH_HO_SO_MAC_DINH,
} from '../data/labDictionary';

interface AppContextType {
  // Dữ liệu phiên hiện tại (khi tải & kiểm tra phiếu mới)
  currentImage: string | null;
  setCurrentImage: (img: string | null) => void;
  currentReport: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  } | null;
  setCurrentReport: React.Dispatch<
    React.SetStateAction<{
      ngayXetNghiem: string;
      nhanPhieu: string;
      chiSo: ChiSoItem[];
    } | null>
  >;
  selectedDemoScenario: 'A' | 'ERROR';
  setSelectedDemoScenario: (scenario: 'A' | 'ERROR') => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Lịch sử từ Firestore
  savedReports: SavedReport[];
  isLoadingReports: boolean;
  loadSavedReports: () => Promise<void>;
  saveReportToFirestore: (reportData: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  }) => Promise<{ success: boolean; id?: string; error?: string }>;
  seedInitialDataIfEmpty: () => Promise<void>;

  // So sánh
  compareSelectedIds: string[];
  setCompareSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleCompareSelect: (id: string) => void;

  // Hệ thống Hồ sơ & Đăng nhập Local
  currentUser: UserProfile | null;
  profiles: UserProfile[];
  switchProfile: (profileId: string) => void;
  loginUser: (phoneOrId: string) => boolean;
  logoutUser: () => void;
  createProfile: (data: Omit<UserProfile, 'id' | 'maHoSo'>) => UserProfile;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<{
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  } | null>(null);

  // Kịch bản demo kiểm thử: 'A' hoặc 'ERROR'
  const [selectedDemoScenario, setSelectedDemoScenario] = useState<'A' | 'ERROR'>('A');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Lịch sử báo cáo
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);

  // Chọn 2 phiếu để so sánh
  const [compareSelectedIds, setCompareSelectedIds] = useState<string[]>([]);

  // Local Authentication & Profiles
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('meddecode_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Không thể nạp hồ sơ từ localStorage:', e);
    }
    return DANH_SACH_HO_SO_MAC_DINH;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const activeId = localStorage.getItem('meddecode_active_user_id');
      if (activeId) {
        const found = DANH_SACH_HO_SO_MAC_DINH.find((p) => p.id === activeId);
        if (found) return found;
      }
    } catch (e) {
      console.warn('Không thể nạp tài khoản active từ localStorage:', e);
    }
    // Mặc định đăng nhập hồ sơ đầu tiên
    return DANH_SACH_HO_SO_MAC_DINH[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Lưu profiles vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('meddecode_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Lỗi lưu profiles vào localStorage:', e);
    }
  }, [profiles]);

  // Lưu active user vào localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('meddecode_active_user_id', currentUser.id);
      } else {
        localStorage.removeItem('meddecode_active_user_id');
      }
    } catch (e) {
      console.warn('Lỗi lưu active user vào localStorage:', e);
    }
  }, [currentUser]);

  const switchProfile = (profileId: string) => {
    const found = profiles.find((p) => p.id === profileId);
    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
    }
  };

  const loginUser = (phoneOrId: string): boolean => {
    const clean = phoneOrId.trim().replace(/\s+/g, '');
    const found = profiles.find(
      (p) =>
        p.id === clean ||
        p.maHoSo.toLowerCase() === clean.toLowerCase() ||
        p.soDienThoai.replace(/\s+/g, '') === clean
    );
    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      return true;
    }
    // Nếu không tìm thấy, nếu nhập số điện thoại thì tạo hồ sơ nhanh
    if (clean.length >= 8) {
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        hoTen: `Người dùng ${clean.slice(-4)}`,
        namSinh: 1995,
        gioiTinh: 'Nam',
        nhomMau: 'O+',
        soDienThoai: phoneOrId.trim(),
        maHoSo: `BN-${Math.floor(10000 + Math.random() * 90000)}`,
        avatarColor: 'bg-teal-700',
      };
      setProfiles((prev) => [...prev, newProfile]);
      setCurrentUser(newProfile);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const createProfile = (data: Omit<UserProfile, 'id' | 'maHoSo'>): UserProfile => {
    const colors = ['bg-teal-600', 'bg-rose-600', 'bg-indigo-600', 'bg-sky-600', 'bg-emerald-600', 'bg-amber-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newProfile: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      maHoSo: `BN-${Math.floor(10000 + Math.random() * 90000)}`,
      avatarColor: data.avatarColor || randomColor,
    };
    setProfiles((prev) => [...prev, newProfile]);
    setCurrentUser(newProfile);
    setIsAuthModalOpen(false);
    return newProfile;
  };

  // Tải danh sách phiếu đã lưu từ Firestore
  const loadSavedReports = async () => {
    setIsLoadingReports(true);
    try {
      const colRef = collection(db, 'savedReports');
      const snapshot = await getDocs(colRef);
      const reports: SavedReport[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ngayXetNghiem: data.ngayXetNghiem || '',
          nhanPhieu: data.nhanPhieu || `Phiếu xét nghiệm ${data.ngayXetNghiem}`,
          chiSo: Array.isArray(data.chiSo) ? data.chiSo : [],
          createdAt: data.createdAt,
        });
      });

      // Sắp xếp ngày giảm dần
      reports.sort((a, b) => {
        return new Date(b.ngayXetNghiem).getTime() - new Date(a.ngayXetNghiem).getTime();
      });

      setSavedReports(reports);

      // Nếu collection rỗng, tự động seed Phiếu B
      if (reports.length === 0) {
        await seedInitialDataIfEmpty();
      }
    } catch (err) {
      console.warn('Không thể nạp dữ liệu từ Firestore hoặc collection rỗng:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // Seed Phiếu B vào Firestore nếu savedReports rỗng
  const seedInitialDataIfEmpty = async () => {
    try {
      const colRef = collection(db, 'savedReports');
      const checkSnapshot = await getDocs(colRef);
      if (checkSnapshot.empty) {
        await addDoc(colRef, {
          ngayXetNghiem: KICH_BAN_PHIEU_B.ngayXetNghiem,
          nhanPhieu: KICH_BAN_PHIEU_B.nhanPhieu,
          chiSo: KICH_BAN_PHIEU_B.chiSo,
          createdAt: serverTimestamp(),
        });
        // Tải lại danh sách
        const newSnapshot = await getDocs(colRef);
        const seeded: SavedReport[] = [];
        newSnapshot.forEach((doc) => {
          const data = doc.data();
          seeded.push({
            id: doc.id,
            ngayXetNghiem: data.ngayXetNghiem || '',
            nhanPhieu: data.nhanPhieu || `Phiếu xét nghiệm ${data.ngayXetNghiem}`,
            chiSo: Array.isArray(data.chiSo) ? data.chiSo : [],
            createdAt: data.createdAt,
          });
        });
        setSavedReports(seeded);
      }
    } catch (err) {
      console.warn('Không thể seed dữ liệu mẫu vào Firestore:', err);
    }
  };

  // Lưu 1 document vào Firestore (FR06)
  const saveReportToFirestore = async (reportData: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  }) => {
    try {
      const colRef = collection(db, 'savedReports');
      const docRef = await addDoc(colRef, {
        ngayXetNghiem: reportData.ngayXetNghiem,
        nhanPhieu: reportData.nhanPhieu,
        chiSo: reportData.chiSo,
        createdAt: serverTimestamp(),
      });

      // Tải lại danh sách sau khi lưu
      await loadSavedReports();
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Lỗi khi ghi document vào Firestore:', error);
      return {
        success: false,
        error: error?.message || 'Lỗi kết nối Firebase Firestore.',
      };
    }
  };

  // Chọn / bỏ chọn phiếu để so sánh (tối đa 2 phiếu)
  const toggleCompareSelect = (id: string) => {
    setCompareSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 2) {
          // Thay thế phiếu cũ nhất
          return [prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  // Tự động tải danh sách phiếu từ Firestore khi khởi động
  useEffect(() => {
    loadSavedReports();
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentImage,
        setCurrentImage,
        currentReport,
        setCurrentReport,
        selectedDemoScenario,
        setSelectedDemoScenario,
        isDirty,
        setIsDirty,
        savedReports,
        isLoadingReports,
        loadSavedReports,
        saveReportToFirestore,
        seedInitialDataIfEmpty,
        compareSelectedIds,
        setCompareSelectedIds,
        toggleCompareSelect,
        currentUser,
        profiles,
        switchProfile,
        loginUser,
        logoutUser,
        createProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
