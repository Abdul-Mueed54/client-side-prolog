import { create } from "zustand";

import { DashboardStats } from "@/types";

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          credentials: "include"
        },
      );

      if (!response.ok) throw new Error("Failed to fetch dashboard statistics");

      const result = await response.json();
      if (result.success) {
        set({ stats: result.data, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred", isLoading: false });
    }
  },
}));
