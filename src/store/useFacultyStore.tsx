import { create } from "zustand";
import { Faculty } from "@/types";
import { useAuthStore } from "./useAuthStore";
import { error } from "console";

export interface NewFacultyPayload {
  userName: string;
  userEmail: string;
  userContactNo: string;
  password: string;
  deptAbbreviation: string;
  designation: string;
  areaOfResearch: string;
}

export interface FetchFacultyParams {
  deptAbbreviation?: string;
}

interface FacultyStore {
  faculty: Faculty[];
  isLoading: boolean;
  error: null | string;
  fetchFaculty: (params: FetchFacultyParams) => Promise<void>;
  addFaculty: (data: NewFacultyPayload) => Promise<void>;
}

export const useFacultyStore = create<FacultyStore>((set, get) => ({
  faculty: [],
  isLoading: false,
  error: null,

  fetchFaculty: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/users/getUsers/?role=faculty`,
      );

      if (params.deptAbbreviation) {
        url.searchParams.append("deptAbbreviation", params.deptAbbreviation);
      }

      const response = await fetch(url, { method: "GET", headers });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch faculty");
      }

      const formattedFaculty: Faculty[] = json.data.map((rawFac: any) => ({
        facultyId: rawFac.user_id,
        facultyName: rawFac.user_name,
        facultyEmail: rawFac.user_email,
        facultyContactNo: rawFac.user_contact_no,
        isActive: rawFac.is_active,
        deptAbbreviation: rawFac.dept_abbreviation,
      }));

      set({
        faculty: formattedFaculty,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching faculty.",
        faculty: [],
      });
    }
  },

  addFaculty: async (data: NewFacultyPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/faculty`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );
      console.log(data);
      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        set({ error: json.message });
        throw new Error(json.message || "Failed to add faculty");
      }

      const rawFac = json.data;
      console.log(rawFac)

      const newFaculty: Faculty = {
        facultyId: rawFac.userId,
        facultyName: rawFac.userName,
        facultyEmail: rawFac.userEmail,
        facultyContactNo: rawFac.userContactNo,
        role: rawFac.role,
        isActive: rawFac.isActive,
        deptAbbreviation: data.deptAbbreviation,
      };

      set((state) => ({
        faculty: [newFaculty, ...state.faculty],
      }));
    } catch (error: any) {
      console.error("Error adding faculty:", error);
      throw error;
    }
  },
}));
