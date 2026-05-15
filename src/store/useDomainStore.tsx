import { create } from "zustand";
import { Domains } from "@/types";
import { useAuthStore } from "./useAuthStore";
import { promises } from "dns";
import { error } from "console";

interface DomainStore {
  domains: Domains[];
  isLoading: boolean;
  error: null | string;

  fetchDomains: () => Promise<void>;
}

export const useDomainsStore = create<DomainStore>((set) => ({
  domains: [],
  isLoading: false,
  error: null,

  fetchDomains: async () => {
    set({ isLoading: true });

    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/domains`,
        { method: "GET", headers },
      );

      const json = await response.json();
      if (!response.ok) {
        set({
          error: json.message || "Failed to fetch domais",
          isLoading: false,
        });
        return;
      }

      const formattedDomains = json.data.map((rawDomain: any) => ({
        id: rawDomain.domain_id,
        name: rawDomain.domain_name,
        description: rawDomain.domain_description,
        deptAbbreviation: rawDomain.dept_abbreviation,
      }));

      set({
        domains: formattedDomains,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.message ||
          "An unexpected error occurred while fetching domains.",
        domains: [], // Optionally clear stale data
      });
    }
  },
}));
