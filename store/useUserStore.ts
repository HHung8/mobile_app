// store/userStore.ts
import { create } from 'zustand';

interface UserStore {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
  reset: () => set({ isAdmin: false }),
}));