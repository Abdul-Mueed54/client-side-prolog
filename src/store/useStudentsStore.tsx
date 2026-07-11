import { create } from "zustand";
import { Students } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewStudentPayload {
  seatNo: string;
  stdName: string;
  stdEmail: string;
  batch: string;
  deptAbbr: string;
}

export interface FetchStudentsFilters {
  limit?: number;
  deptAbbreviation?: string;
  batch?: string;
}

interface StudentStore {
  students: Students[];
  isLoading: boolean;
  error: null | string;

  totalPages: number;
  currentPage: number;
  totalStudents: number;

  fetchStudents: ( page?: number, search?: string, filters?: FetchStudentsFilters,) => Promise<void>;
  addStudent: (data: NewStudentPayload) => Promise<void>;
  updateStudent: ( seatNo: string, data: Partial<NewStudentPayload>,) => Promise<void>;
  deleteStudent: (seatNo: string) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalStudents: 0,

  // 2. Accept page directly, default to 1
  fetchStudents: async (
    page: number = 1,
    search: string = "",
    filters: FetchStudentsFilters = {},
  ) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/students/getStudents/`,
      );

      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

       if (search) {
        url.searchParams.append("search", search);
      }

      if (filters.deptAbbreviation) {
        url.searchParams.append("deptAbbreviation", filters.deptAbbreviation);
      }
      if (filters.batch) {
        url.searchParams.append("batch", filters.batch);
      }

      const response = await fetch(url, { method: "GET", headers });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch students");
      }

      const students = json.data.data || [];
      const meta = json.data.meta || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
      };

      set({
        students: students,
        totalPages: meta.totalPages,
        // 3. Force it to use our requested page number to ensure state syncs properly
        currentPage: page,
        totalStudents: meta.totalRecords,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching students.",
        students: [],
      });
    }
  },

  addStudent: async (data: NewStudentPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add student");
      }

      const newStudent = json.data;

      set((state) => ({
        students: [newStudent, ...state.students],
        totalStudents: state.totalStudents + 1,
      }));
    } catch (error: any) {
      console.error("Error adding student:", error);
      throw error;
    }
  },

  updateStudent: async (seatNo: string, data: Partial<NewStudentPayload>) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${seatNo}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update student");
      }

      set((state) => ({
        students: state.students.map((std) =>
          std.seatNo === seatNo
            ? {
                ...std,
                stdName: data.stdName ?? std.stdName,
                stdEmail: data.stdEmail ?? std.stdEmail,
                batch: data.batch ?? std.batch,
                deptAbbreviation:
                  data.deptAbbr ??
                  std.deptAbbreviation ??
                  (std as any).deptAbbr,
              }
            : std,
        ),
      }));
    } catch (error: any) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  deleteStudent: async (seatNo: string) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${seatNo}`,
        {
          method: "DELETE",
          headers,
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete student");
      }

      set((state) => ({
        students: state.students.filter((std) => std.seatNo !== seatNo),
        totalStudents: Math.max(0, state.totalStudents - 1),
      }));
    } catch (error: any) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },
}));
