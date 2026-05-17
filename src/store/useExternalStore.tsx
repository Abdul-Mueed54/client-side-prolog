import { create } from "zustand";
import { Externals } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewExternalPayload {
  extName: string;
  extEmail: string;
  extDesignation: string;
  industryName: string;
}

interface ExternalStore {
  externals: Externals[];
  isLoading: boolean;
  error: null | string;
  fetchExternals: () => Promise<void>;
  addExternal: (data: NewExternalPayload) => Promise<void>;
}

export const useExternalStore = create<ExternalStore>((set, get) => ({
  externals: [],
  isLoading: false,
  error: null,

  fetchExternals: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/externals/getExternals/`,
        { method: "GET", headers }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch external supervisors");
      }

      const formattedExternals: Externals[] = json.data.map((rawExt: any) => ({
        extEmail: rawExt.ext_email,
        extName: rawExt.ext_name,
        extDesignation: rawExt.ext_designation,
        industryId: rawExt.industry_id,
      }));

      set({
        externals: formattedExternals,
        isLoading: false,
        error: null,
      });

    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "An unexpected error occurred while fetching externals.",
        externals: [],
      });
    }
  },

  addExternal: async (data: NewExternalPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/externals/`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      console.log("data", data)
      console.log("body", response.body)
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add external supervisor");
      }

      const newExternal = json.data;

      // const newExternal: Externals = {
      //   extEmail: rawExt.extEmail,
      //   name: rawExt.extName,
      //   designation: rawExt.extDesignation,
      //   industryName: rawExt.industryName, // Grabbing the name the backend returns
      //   industryId: data.industryId,       // Restoring the ID from our payload so the UI doesn't break!
      // };

      set((state) => ({
        externals: [newExternal, ...state.externals],
      }));

    } catch (error: any) {
      console.error("Error adding external:", error);
      throw error;
    }
  },
}));