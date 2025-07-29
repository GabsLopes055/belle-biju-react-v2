import { create } from "zustand";

interface UIStore {
  isLoading: boolean;
  isSidebarOpen: boolean;
  activeModal: string | null;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  isSidebarOpen: true,
  activeModal: null,
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
