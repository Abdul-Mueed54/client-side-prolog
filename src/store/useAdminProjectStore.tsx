import { create } from "zustand";
import { Project } from "@/types";
import { useAuthStore } from "./useAuthStore";

interface AdminProjectStore {
  adminProjects: Project[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  error: string | null;

  // Admin specific actions
  fetchAdminProjects: (page: number) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useAdminProjectStore = create<AdminProjectStore>((set) => ({
  adminProjects: [],
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  isLoading: false,
  error: null,

  fetchAdminProjects: async (page: number) => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const skipOffset = (page - 1) * 10;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/pageprojects/?offset=${skipOffset}&limit=10`,
        { method: "GET", headers },
      );
      const json = await response.json();
      

      if (!response.ok) {
        // Instead of throwing an error, we set the error state and EXIT the function safely.
        set({
          error: `Failed to load data (Server Error: ${response.status}). Please try again later.`,
          isLoading: false, // Clear the table so they don't see old data
        });
        return;
      }

      // Success: populate the store
      set({
        adminProjects: json.data,
        totalPages: json.meta?.totalPages || 1, // Safe navigation
        currentPage: page,
        totalRecords: json.meta?.totalRecords || 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Fetch admin projects failed:", error);

      // Failure: gracefully handle the error and clear previous potentially invalid state
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching projects.",
        adminProjects: [], // Optionally clear stale data
        totalRecords: 0,
        totalPages: 1,
      });
    }
  },

  deleteProject: async (id: string) => {
    // Future logic for deleting from the admin table
  },
}));
