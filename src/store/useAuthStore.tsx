import { create } from 'zustand';

export type Role = 'guest' | 'faculty' | 'staff' | 'admin';

interface AuthState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'admin', // Default to guest
  setRole: (role) => set({ role }),
}));