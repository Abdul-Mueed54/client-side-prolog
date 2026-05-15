import { create } from "zustand";
import { Grants } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewGrantPayload {
  name: string;
  amount: string;
  industryName: string;
}

interface GrantStore {
  grants: Grants[];
  isLoading: boolean;
  error: null | string;
  fetchGrants: () => Promise<void>;
  addGrant: (data: NewGrantPayload) => Promise<void>;
}

export const useGrantStore = create<GrantStore>((set) => ({
  grants: [],
  isLoading: false,
  error: null,

  fetchGrants: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grants/getGrants/`,
        { method: "GET", headers },
      );

      const json = await response.json();

      if (!response.ok) {
        set({
          error: json.message || "Failed to fetch grants",
          isLoading: false,
        });
        return;
      }

      const formattedGrants: Grants[] = json.data.map((rawGrant: any) => ({
        projectId: rawGrant.project_id,
        name: rawGrant.grant_name,
        amount: rawGrant.grant_amount,
        industryName: rawGrant.industry_name,
      }));

      set({
        grants: formattedGrants,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching grants.",
        grants: [],
      });
    }
  },

  addGrant: async (data: NewGrantPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Ensure this endpoint matches your backend route!
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grants/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add grant");
      }

      const rawGrant = json.data;

      const newGrant: Grants = {
        projectId: rawGrant.project_id,
        name: rawGrant.grant_name,
        amount: rawGrant.grant_amount,
        industryName: rawGrant.industry_name,
      };

      set((state) => ({
        grants: [newGrant, ...state.grants],
      }));
    } catch (error: any) {
      console.error("Error adding grant:", error);
      throw error;
    }
  },
}));
