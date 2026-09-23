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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<{
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  } | null>(null);

  // Kịch bản demo kiểm thử: 'A' (phiếu A có lỗi cần sửa) hoặc 'ERROR' (ảnh không rõ)
  const [selectedDemoScenario, setSelectedDemoScenario] = useState<'A' | 'ERROR'>('A');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Lịch sử báo cáo
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);

  // Chọn 2 phiếu để so sánh
  const [compareSelectedIds, setCompareSelectedIds] = useState<string[]>([]);

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

      // Nếu collection rỗng, tự động seed Phiếu B như yêu cầu mục 9 & 10
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
        // Tải lại sau khi seed
        const newSnapshot = await getDocs(colRef);
        const seededList: SavedReport[] = [];
        newSnapshot.forEach((doc) => {
          const data = doc.data();
          seededList.push({
            id: doc.id,
            ngayXetNghiem: data.ngayXetNghiem,
            nhanPhieu: data.nhanPhieu,
            chiSo: data.chiSo,
            createdAt: data.createdAt,
          });
        });
        setSavedReports(seededList);
      }
    } catch (e) {
      console.error('Lỗi khi seed Phiếu B mẫu vào Firestore:', e);
    }
  };

  // Khởi động lần đầu: load Firestore
  useEffect(() => {
    loadSavedReports();
  }, []);

  // Lưu 1 document vào collection savedReports trên Firestore (FR06)
  const saveReportToFirestore = async (reportData: {
    ngayXetNghiem: string;
    nhanPhieu: string;
    chiSo: ChiSoItem[];
  }): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const colRef = collection(db, 'savedReports');
      const docRef = await addDoc(colRef, {
        ngayXetNghiem: reportData.ngayXetNghiem,
        nhanPhieu: reportData.nhanPhieu,
        chiSo: reportData.chiSo,
        createdAt: serverTimestamp(),
      });
      setIsDirty(false);
      // Cập nhật lại danh sách local
      await loadSavedReports();
      return { success: true, id: docRef.id };
    } catch (err: any) {
      console.error('Lỗi khi lưu Firestore:', err);
      return { success: false, error: err?.message || 'Lỗi không xác định' };
    }
  };

  const toggleCompareSelect = (id: string) => {
    setCompareSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 2) {
          // Chỉ chọn tối đa 2 phiếu
          return [prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

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
