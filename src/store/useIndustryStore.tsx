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
        `${process.env.NEXT_PUBLIC_API_URL}/industries/getIndustries`, // Make sure this endpoint matches your backend route!
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

      // MAP THE DATA: Convert snake_case to our clean frontend interface
      const formattedIndustries: Industry[] = json.data.map(
        (rawIndustry: any) => ({
          id: rawIndustry.industry_id,
          name: rawIndustry.industry_name,
          location: rawIndustry.location,
          type: rawIndustry.industry_type,
          email: rawIndustry.industry_email,
        }),
      );

      // Save the clean data to the state
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

      // === THE OPTIMIZATION ===
      // Assuming `json.data` contains the newly created object from the backend:
      const rawIndustry = json.data;

      const newIndustry: Industry = {
        id: rawIndustry.industry_id,
        name: rawIndustry.industry_name,
        location: rawIndustry.location,
        type: rawIndustry.industry_type,
        email: rawIndustry.industry_email,
      };

      // Instantly inject it into the frontend state (putting it at the top of the list)
      set((state) => ({
        industries: [newIndustry, ...state.industries],
      }));
    } catch (error: any) {
      console.error("Error adding industry:", error);
      throw error;
    }
  },
}));
