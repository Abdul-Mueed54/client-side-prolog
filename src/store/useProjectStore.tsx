import { create } from "zustand";
import { Project } from "@/types";
import { useAuthStore } from "./useAuthStore";
import { useFilterStore } from "./useFilterStore";

interface ProjectStore {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading: boolean;
  error: string | null;
  fetchProjects: (page: number, search?: string, isDeleted?: boolean) => Promise<void>;
  archiveProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  isLoading: false,
  error: null,

  fetchProjects: async (page: number, search: string = "", isDeleted: boolean = false) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const filters = useFilterStore.getState();

      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/getProjects`,
      );

      const skipOffset = (page - 1) * 10;
      url.searchParams.append("limit", "10");
      url.searchParams.append("offset", skipOffset.toString());
      
      if (isDeleted) {
        url.searchParams.append("isDeleted", "true");
      }
      if (search) {
        url.searchParams.append("search", search);
      }

      if (filters.selectedDepartment) {
        url.searchParams.append("deptAbbreviation", filters.selectedDepartment);
      }
      if (filters.selectedDomains.length > 0) {
        url.searchParams.append("domainId", filters.selectedDomains.join(","));
      }
      if (filters.selectedIndustries.length > 0) {
        url.searchParams.append(
          "industries",
          filters.selectedIndustries.join(","),
        );
      }
      if (filters.selectedYears.length > 0) {
        url.searchParams.append(
          "academicYear",
          filters.selectedYears.join(","),
        );
      }

      const response = await fetch(url, { method: "GET", headers });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch projects");
      }

      set({
        projects: json.data.data || [],
        totalPages: json.data.meta?.totalPages || 1,
        currentPage: page,
        totalRecords:
          json.data.meta?.totalRecords || (json.data ? json.data.length : 0),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  archiveProject: async (projectId: string) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/archive`,
        {
          method: "PATCH",
          headers,
        }
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to archive project");
      }

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        totalRecords: Math.max(0, state.totalRecords - 1),
      }));

    } catch (error: any) {
      console.error("Error archiving project:", error);
      throw error;
    }
  },
}));