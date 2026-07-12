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
  updateExternal: (
    email: string,
    data: Partial<NewExternalPayload>,
  ) => Promise<void>;
  deleteExternal: (email: string) => Promise<void>;
}

export const useExternalStore = create<ExternalStore>((set, get) => ({
  externals: [],
  isLoading: false,
  error: null,

  fetchExternals: async () => {
    set({ isLoading: true, error: null });

    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/externals/getExternals/`,
        { method: "GET", headers, credentials: "include" },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch external supervisors");
      }

      const formattedExternals: Externals[] = json.data.data.map((rawExt: any) => ({
        extEmail: rawExt.extEmail,
        extName: rawExt.extName,
        extDesignation: rawExt.extDesignation,
        industryId: rawExt.industryId,
        industryName: rawExt.industryName,
      }));

      set({
        externals: formattedExternals,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching externals.",
        externals: [],
      });
    }
  },

  addExternal: async (data: NewExternalPayload) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/externals/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
        },
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to add external supervisor");
      }

      const newExternal = json.data.data;

      set((state) => ({
        externals: [newExternal, ...state.externals],
      }));
    } catch (error: any) {
      console.error("Error adding external:", error);
      throw error;
    }
  },
  updateExternal: async (email: string, data: Partial<NewExternalPayload>) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/externals/${email}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update external supervisor");
      }

      set((state) => ({
        externals: state.externals.map((ext) =>
          ext.extEmail === email
            ? {
                ...ext,
                extName: data.extName ?? ext.extName,
                extEmail: data.extEmail ?? ext.extEmail,
                extDesignation: data.extDesignation ?? ext.extDesignation,
                industryName: data.industryName ?? ext.industryName, // Fixed key
              }
            : ext,
        ),
      }));
    } catch (error: any) {
      console.error("Error updating external supervisor:", error);
      throw error;
    }
  },

  deleteExternal: async (email: string) => {
    try {
      const headers: any = { "Content-Type": "application/json" };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/externals/${email}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete external supervisor");
      }

      set((state) => ({
        externals: state.externals.filter((ext) => ext.extEmail !== email),
      }));
    } catch (error: any) {
      console.error("Error deleting external supervisor:", error);
      throw error;
    }
  },
}));
