import { create } from "zustand";
import { Staff } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewStaffPayload {
  userName: string;
  userEmail: string;
  userContactNo: string;
  password: string;
  deptAbbreviation: string;
  jobTitle: string;
}

interface FetchStaffParams {
  deptAbbreviation?: string;
}

interface StaffStore {
  staff: Staff[];
  isLoading: boolean;
  error: null | string;
  fetchStaff: (params?: FetchStaffParams) => Promise<void>;
  addStaff: (data: NewStaffPayload) => Promise<void>;
}

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchStaff: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const headers: any = { "Content-Type": "application/json" };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/getUsers/`);
      url.searchParams.append("role", "staff");

      if (params.deptAbbreviation) {
        url.searchParams.append("deptAbbreviation", params.deptAbbreviation);
      }

      const response = await fetch(url.toString(), { method: "GET", headers, credentials: "include", });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch staff");
      }

      const formattedStaff: Staff[] = json.data.data.map((rawStaff: any) => ({
        staffId: rawStaff.user_id,
        staffName: rawStaff.user_name,
        staffEmail: rawStaff.user_email,
        staffContactNo: rawStaff.user_contact_no,
        deptAbbreviation: rawStaff.dept_abbreviation,
        role: rawStaff.role,
        isActive: rawStaff.is_active,
        jobTitle: rawStaff.job_title || undefined,
      }));

      set({
        staff: formattedStaff,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "An unexpected error occurred.",
        staff: [],
      });
    }
  },

  addStaff: async (data: NewStaffPayload) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/staff`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add staff");
      }
      const rawStaff = json.data;
      const newStaff: Staff = {
        staffId: rawStaff.userId,
        staffName: rawStaff.userName,
        staffEmail: rawStaff.userEmail,
        staffContactNo: rawStaff.userContactNo,
        deptAbbreviation: rawStaff.deptAbbreviation,
        role: rawStaff.role,
        isActive: rawStaff.isActive,
        jobTitle: rawStaff.jobTitle,
      };

      set((state) => ({
        staff: [newStaff, ...state.staff],
      }));
    } catch (error: any) {
      console.error("Error adding staff:", error);
      throw error;
    }
  },
}));
