import { create } from "zustand";
import { Project } from "@/types";
import { useAuthStore } from "./useAuthStore"; // Import your auth store

interface ProjectStore {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  error: string | null;
  fetchProjects: (page: number, search?: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  isLoading: false,
  error: null,

  fetchProjects: async (page: number, search: string = "") => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const skipOffset = (page - 1) * 10;
      let url = "";
      if (search) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/projects/searchProjects/?search=${encodeURIComponent(search)}&offset=${skipOffset}&limit=10`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/projects/pageprojects/?offset=${skipOffset}&limit=10`;
      }
      const response = await fetch(url, { method: "GET", headers });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const json = await response.json();

      // 3. Save everything to the store
      set({
        projects: json.data,
        totalPages: json.meta?.totalPages || 1,
        currentPage: page,
        totalRecords: json.meta?.totalRecords || json.data.length,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
