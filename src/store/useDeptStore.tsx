import { create } from "zustand";
import { Departments } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewDepartmentPayload {
  deptAbbreviation: string;
  deptName: string;
}

interface DepartmentStore {
  departments: Departments[];
  isLoading: boolean;
  error: null | string;
  fetchDepartments: () => Promise<void>;
  addDepartment: (data: NewDepartmentPayload) => Promise<void>;
}

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/departments/getDepartments`,
        { method: "GET", headers },
      );

      const json = await response.json();

      if (!response.ok) {
        set({
          error: json.message || "Failed to fetch departments",
          isLoading: false,
        });
        return;
      }

      const formattedDepts: Departments[] = json.data.map((rawDept: any) => ({
        deptAbbreviation: rawDept.dept_abbreviation,
        deptName: rawDept.dept_name,
      }));

      set({
        departments: formattedDepts,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching departments.",
        departments: [],
      });
    }
  },

  addDepartment: async (data: NewDepartmentPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/departments/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add department");
      }

      const newDepartment = json.data;

      set((state) => ({
        departments: [newDepartment, ...state.departments],
      }));
    } catch (error: any) {
      console.error("Error adding department:", error);
      throw error;
    }
  },
}));
