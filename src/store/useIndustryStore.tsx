import { create } from "zustand";
import { Industry } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewIndustryPayload {
  industryName: string;
  location: string;
  industryType: string;
  industryEmail: string;
}

interface IndustryStore {
  industries: Industry[];
  isLoading: boolean;
  error: null | string;
  fetchIndustries: () => Promise<void>;
  addIndustry: (data: NewIndustryPayload) => Promise<void>;
}

export const useIndustryStore = create<IndustryStore>((set) => ({
  industries: [],
  isLoading: false,
  error: null,

  fetchIndustries: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/getIndustries`,
        { method: "GET", headers },
      );

      const json = await response.json();

      if (!response.ok) {
        set({
          error: json.message || "Failed to fetch industries",
          isLoading: false,
        });
        return;
      }

      const formattedIndustries: Industry[] = json.data.map(
        (rawIndustry: any) => ({
          industryId: rawIndustry.industry_id,
          industryName: rawIndustry.industry_name,
          industryLocation: rawIndustry.location,
          industryType: rawIndustry.industry_type,
          industryEmail: rawIndustry.industry_email,
        }),
      );

      set({
        industries: formattedIndustries,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching industries.",
        industries: [],
      });
    }
  },

  addIndustry: async (data: NewIndustryPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add industry");
      }

      const newIndustry = json.data;

      // the problem is in the mapping and returning data

      set((state) => ({
        industries: [newIndustry, ...state.industries],
      }));
    } catch (error: any) {
      console.error("Error adding industry:", error);
      throw error;
    }
  },
}));
