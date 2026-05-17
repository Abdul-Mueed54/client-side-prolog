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

export interface FetchStudentsParams {
  page?: number;
  offset?: number;
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

  fetchStudents: (params?: FetchStudentsParams) => Promise<void>;
  addStudent: (data: NewStudentPayload) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalStudents: 0,

  fetchStudents: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/students/getStudents/`,
      );

      const page = params.page || 1;
      const limit = params.limit || 10;
      const offset = (page - 1) * limit;

      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

      if (params.deptAbbreviation) {
        url.searchParams.append("deptAbbreviation", params.deptAbbreviation);
      }
      if (params.batch) {
        url.searchParams.append("batch", params.batch);
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
        currentPage: meta.currentPage,
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
      console.log(json);

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
}));
