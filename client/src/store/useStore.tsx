import { create } from 'zustand';

interface StoreState {
    userId: string | null; // ID có thể là chuỗi hoặc null
    setId: (newId: string | null) => void; // Hàm để cập nhật ID
    myAccount: Record<string, any> | null; // Cấu trúc dữ liệu tài khoản, bạn có thể thay `Record<string, any>` bằng kiểu dữ liệu cụ thể nếu cần
    setMyAccount: (newMyAccount: Record<string, any> | null) => void; // Hàm để cập nhật tài khoản
}

const useStore = create<StoreState>((set) => ({
    userId: null,
    setId: (newId) => set({ userId: newId }),
    myAccount: null,
    setMyAccount: (newMyAccount) => set({ myAccount: newMyAccount }),
}));

export default useStore;
