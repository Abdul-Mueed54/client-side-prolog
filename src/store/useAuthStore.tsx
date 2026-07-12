import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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
  login: (userData: User, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: "guest",
      user: null,
      token: null,

      login: (userData, role) => set({ user: userData, role }),
      logout: async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        set({ user: null, role: "guest" });
      },
    }),
    {
      name: "prolog-auth", 
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
