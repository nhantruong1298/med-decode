import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  SavedReport,
  ChiSoItem,
  UserProfile,
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

  // Kịch bản demo kiểm thử
  selectedDemoScenario: 'A' | 'ERROR';
  setSelectedDemoScenario: (s: 'A' | 'ERROR') => void;

  // Trạng thái đã sửa đổi dữ liệu (Dirty state)
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Lịch sử báo cáo kết quả (Lưu vào Cloud Firestore)
  savedReports: SavedReport[];
  isLoadingReports: boolean;
  loadSavedReports: () => Promise<void>;
  saveReportToFirestore: (report: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  }) => Promise<{ success: boolean; id?: string; error?: string }>;

  // Chọn phiếu so sánh
  compareSelectedIds: string[];
  setCompareSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleCompareSelect: (id: string) => void;

  // Hệ thống Hồ sơ Bệnh nhân thật (lưu vào Firestore)
  currentUser: UserProfile | null;
  profiles: UserProfile[];
  isLoadingProfiles: boolean;
  loadProfilesFromFirestore: () => Promise<void>;
  switchProfile: (profileId: string) => void;
  loginUser: (phoneOrId: string) => boolean;
  logoutUser: () => void;
  createProfile: (data: Omit<UserProfile, 'id' | 'maHoSo'>) => Promise<UserProfile>;
  deleteProfile: (profileId: string) => Promise<void>;
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

  // Hồ sơ bệnh nhân thật (Nạp từ Firestore và lưu cache)
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('meddecode_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Lọc bỏ triệt để các ID hồ sơ giả cũ
        if (Array.isArray(parsed)) {
          const realOnly = parsed.filter(
            (p: any) => p && p.id && !['user-1', 'user-2', 'user-3'].includes(p.id)
          );
          return realOnly;
        }
      }
    } catch (e) {
      console.warn('Không thể nạp hồ sơ từ cache:', e);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const activeId = localStorage.getItem('meddecode_active_user_id');
      if (activeId && !['user-1', 'user-2', 'user-3'].includes(activeId)) {
        const saved = localStorage.getItem('meddecode_profiles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const found = parsed.find((p: any) => p.id === activeId);
            if (found) return found;
          }
        }
      }
    } catch (e) {
      console.warn('Không thể nạp tài khoản active từ cache:', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Đồng bộ profiles vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('meddecode_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Lỗi lưu profiles vào cache:', e);
    }
  }, [profiles]);

  // Đồng bộ active user vào localStorage
  useEffect(() => {
    try {
      if (currentUser && !['user-1', 'user-2', 'user-3'].includes(currentUser.id)) {
        localStorage.setItem('meddecode_active_user_id', currentUser.id);
      } else {
        localStorage.removeItem('meddecode_active_user_id');
      }
    } catch (e) {
      console.warn('Lỗi lưu active user vào cache:', e);
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
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Tạo hồ sơ mới thật và lưu vào Firestore
  const createProfile = async (
    data: Omit<UserProfile, 'id' | 'maHoSo'>
  ): Promise<UserProfile> => {
    const colors = [
      'bg-teal-600',
      'bg-rose-600',
      'bg-indigo-600',
      'bg-sky-600',
      'bg-emerald-600',
      'bg-amber-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const generatedCode = `BN-${Math.floor(10000 + Math.random() * 90000)}`;

    let generatedId = `profile-${Date.now()}`;
    try {
      const colRef = collection(db, 'patientProfiles');
      const docRef = await addDoc(colRef, {
        hoTen: data.hoTen,
        namSinh: data.namSinh,
        gioiTinh: data.gioiTinh,
        nhomMau: data.nhomMau,
        soDienThoai: data.soDienThoai,
        maHoSo: generatedCode,
        ghiChuSucKhoe: data.ghiChuSucKhoe || '',
        avatarColor: data.avatarColor || randomColor,
        createdAt: serverTimestamp(),
      });
      generatedId = docRef.id;
    } catch (e) {
      console.warn('Lỗi ghi profile vào Firestore:', e);
    }

    const newProfile: UserProfile = {
      ...data,
      id: generatedId,
      maHoSo: generatedCode,
      avatarColor: data.avatarColor || randomColor,
    };

    setProfiles((prev) => [newProfile, ...prev.filter((p) => p.id !== newProfile.id)]);
    setCurrentUser(newProfile);
    setIsAuthModalOpen(false);
    return newProfile;
  };

  // Xóa hồ sơ khỏi Firestore và bộ nhớ
  const deleteProfile = async (profileId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'patientProfiles', profileId));
    } catch (e) {
      console.warn('Lỗi xóa hồ sơ từ Firestore:', e);
    }

    setProfiles((prev) => {
      const remaining = prev.filter((p) => p.id !== profileId);
      if (currentUser?.id === profileId) {
        setCurrentUser(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });
  };

  // Nạp danh sách hồ sơ từ Cloud Firestore
  const loadProfilesFromFirestore = async () => {
    setIsLoadingProfiles(true);
    try {
      const colRef = collection(db, 'patientProfiles');
      const snapshot = await getDocs(colRef);
      const loaded: UserProfile[] = [];

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        // Loại bỏ bất kỳ doc nào mang id giả
        if (docSnap.id === 'user-1' || docSnap.id === 'user-2' || docSnap.id === 'user-3') return;

        loaded.push({
          id: docSnap.id,
          hoTen: d.hoTen || '',
          namSinh: d.namSinh || 1990,
          gioiTinh: d.gioiTinh || 'Nam',
          nhomMau: d.nhomMau || 'O+',
          soDienThoai: d.soDienThoai || '',
          maHoSo: d.maHoSo || `BN-${docSnap.id.slice(0, 5)}`,
          ghiChuSucKhoe: d.ghiChuSucKhoe || '',
          avatarColor: d.avatarColor || 'bg-teal-600',
        });
      });

      // Cập nhật danh sách từ database
      setProfiles(loaded);

      // Cập nhật active user: nếu chưa chọn hoặc đã đóng hồ sơ thì giữ nguyên null
      setCurrentUser((prev) => {
        if (!prev) return null;
        const matching = loaded.find((p) => p.id === prev.id);
        return matching || null;
      });
    } catch (err) {
      console.warn('Không thể nạp hồ sơ từ Firestore:', err);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  // Tải danh sách phiếu đã lưu từ Firestore (Không tự tạo dữ liệu giả)
  const loadSavedReports = async () => {
    setIsLoadingReports(true);
    try {
      const colRef = collection(db, 'savedReports');
      const snapshot = await getDocs(colRef);
      const reports: SavedReport[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        reports.push({
          id: docSnap.id,
          patientId: data.patientId || '',
          patientName: data.patientName || data.benhNhan || '',
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
    } catch (err) {
      console.warn('Không thể nạp dữ liệu từ Firestore hoặc collection rỗng:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // Lưu 1 document vào Firestore
  const saveReportToFirestore = async (reportData: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  }) => {
    try {
      const colRef = collection(db, 'savedReports');
      const docRef = await addDoc(colRef, {
        patientId: currentUser?.id || '',
        patientName: currentUser?.hoTen || '',
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

  // Tự động tải danh sách phiếu và hồ sơ từ Firestore khi khởi động
  useEffect(() => {
    loadSavedReports();
    loadProfilesFromFirestore();
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
        compareSelectedIds,
        setCompareSelectedIds,
        toggleCompareSelect,
        currentUser,
        profiles,
        isLoadingProfiles,
        loadProfilesFromFirestore,
        switchProfile,
        loginUser,
        logoutUser,
        createProfile,
        deleteProfile,
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
