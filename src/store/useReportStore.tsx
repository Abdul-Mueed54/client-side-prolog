import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface ReportSummary {
  totalStudents: number;
  totalGroups: number;
  totalDepartments: number;
  totalIndustries: number;
  totalExternals: number;
}

export interface DeptStat {
  deptAbbreviation: string;
  studentCount: number;
}

interface ActionItems {
  unassignedGroups: { groupId: string | number; groupLeader: string }[];
  unassignedStudents: { seatNo: string; stdName: string }[];
  emptyIndustries: { industryId: string | number; industryName: string }[];
}

interface ReportStore {
  summary: ReportSummary | null;
  departmentStats: DeptStat[];
  actionItems: ActionItems | null;
  isLoading: boolean;
  error: string | null;
  fetchReportData: () => Promise<void>;
}

export const useReportStore = create<ReportStore>((set) => ({
  summary: null,
  departmentStats: [],
  actionItems: null,
  isLoading: false,
  error: null,

  fetchReportData: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/comprehensive`,
        { method: "GET", headers }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch report data");
      }

      set({
        summary: json.data.summary,
        departmentStats: json.data.departmentStats,
        actionItems: json.data.actionItems,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error fetching report:", error);
      set({
        isLoading: false,
        error: error.message || "Failed to load comprehensive analytics.",
        summary: null,
        departmentStats: [],
        actionItems: null,
      });
    }
  },
}));
