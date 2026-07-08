import { create } from "zustand";
import { Grants } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewGrantPayload {
  grantName: string;
  grantAmount: number;
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

      const grants = json.data.data;

      set({
        grants: grants,
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grants/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();
      console.log("json of grant", data);

      if (!response.ok) {
        throw new Error(json.message || "Failed to add grant");
      }

      const newGrant = json.data;

      set((state) => ({
        grants: [newGrant, ...state.grants],
      }));
    } catch (error: any) {
      console.error("Error adding grant:", error);
      throw error;
    }
  },
}));
