import { create } from "zustand";
import { persist } from "zustand/middleware";
// persist stores state info in local storage of browser

export type Role = "guest" | "faculty" | "staff" | "admin";

interface User {
  user_id: string;
  user_name: string;
  dept_abbreviation: string;
  admin_lvl: number | null;
}

interface AuthState {
  role: Role;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: "guest",
      user: null,
      token: null,

      // Call this when the Express API says "Success!"
      login: (userData, token, role) => set({ user: userData, token, role }),

      // Call this when the user clicks "Sign Out"
      logout: () => set({ user: null, token: null, role: "guest" }),
    }),
    {
      name: "prolog-auth", // This is the key it will use in localStorage
    },
  ),
);
