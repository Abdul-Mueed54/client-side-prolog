import { create } from "zustand";
import { Domains } from "@/types";
import { useAuthStore } from "./useAuthStore";

export interface NewDomainPayload {
  domainName: string;
  domainDescription: string;
  deptAbbreviation: string;
}

interface DomainStore {
  domains: Domains[];
  isLoading: boolean;
  error: null | string;
  fetchDomains: () => Promise<void>;
  addDomain: (data: NewDomainPayload) => Promise<void>;
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

      const formattedDomains = json.data.data.map((rawDomain: any) => ({
        domainId: rawDomain.domain_id,
        domainName: rawDomain.domain_name,
        domainDescription: rawDomain.domain_description,
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
        domains: [], // clear stale data
      });
    }
  },

  addDomain: async (data: NewDomainPayload) => {
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/domains`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const json = await response.json();


      if (!response.ok) {
        throw new Error(json.message || "Failed to add domain");
      }

      const domains = json.data.map((rawDomain: any) => ({
        domainId: rawDomain.domainId,
        domainName: rawDomain.domainName,
        domainDescription: rawDomain.domaindescription,
        deptAbbreviation: rawDomain.deptabbreviation,
      }));
      set((state) => ({
        domains: [...state.domains, domains ],
      }));
    } catch (error: any) {
      console.error("Error adding domain:", error);
      throw error;
    }
  },
}));
