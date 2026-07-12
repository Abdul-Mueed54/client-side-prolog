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
  updateIndustry: (
    id: string,
    data: Partial<NewIndustryPayload>,
  ) => Promise<void>;
  deleteIndustry: (id: string) => Promise<void>;
}

export const useIndustryStore = create<IndustryStore>((set) => ({
  industries: [],
  isLoading: false,
  error: null,

  fetchIndustries: async () => {
    set({ isLoading: true, error: null });

    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/getIndustries`,
        { method: "GET", headers, credentials: "include" },
      );

      const json = await response.json();

      if (!response.ok) {
        set({
          error: json.message || "Failed to fetch industries",
          isLoading: false,
        });
        return;
      }

      const formattedIndustries: Industry[] = json.data.data.map(
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
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
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
  updateIndustry: async (id: string, data: Partial<NewIndustryPayload>) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update industry");
      }

      set((state) => ({
        industries: state.industries.map((ind) =>
          ind.industryId === id
            ? {
                ...ind,
                // Merge new data, keeping existing data if the payload omitted it
                industryName: data.industryName ?? ind.industryName,
                // Map payload's 'location' to the state's 'industryLocation' mapping
                industryLocation: data.location ?? ind.industryLocation,
                industryType: data.industryType ?? ind.industryType,
                industryEmail: data.industryEmail ?? ind.industryEmail,
              }
            : ind,
        ),
      }));
    } catch (error: any) {
      console.error("Error updating industry:", error);
      throw error;
    }
  },

  deleteIndustry: async (id: string) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/industries/${id}`,
        {
          method: "DELETE",
          headers,
          credentials: "include"
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete industry");
      }

      set((state) => ({
        industries: state.industries.filter((ind) => ind.industryId !== id),
      }));
    } catch (error: any) {
      console.error("Error deleting industry:", error);
      throw error;
    }
  },
}));
