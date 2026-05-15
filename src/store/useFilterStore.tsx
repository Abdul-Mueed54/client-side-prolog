import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { Departments, Domains } from "@/types";

interface FilterState {
  selectedDepartment: string;
  selectedDomains: string[];
  selectedIndustries: string[];
  selectedYears: string[];

  setDepartment: (dept: string) => void;
  setDomains: (domains: string[]) => void;
  setIndustries: (industries: string[]) => void;
  setYears: (years: string[]) => void;
  clearAll: () => void;

  departments: Departments[];
  domainMapping: Record<string, Domains[]>;
  industries: string[];
  years: string[];
  isFiltersLoading: boolean;

  fetchFilters: () => Promise<void>;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedDepartment: "",
  selectedDomains: [],
  selectedIndustries: [],
  selectedYears: [],

  departments: [],
  domainMapping: {},
  industries: ["Industry-Linked", "Received Grant"],
  years: ["2026", "2025", "2024", "2023", "2022"],

  isFiltersLoading: false,

  setDepartment: (dept) => set({ selectedDepartment: dept }),
  setDomains: (domains) => set({ selectedDomains: domains }),
  setIndustries: (industries) => set({ selectedIndustries: industries }),
  setYears: (years) => set({ selectedYears: years }),

  clearAll: () =>
    set({
      selectedDepartment: "",
      selectedDomains: [],
      selectedIndustries: [],
      selectedYears: [],
    }),

  fetchFilters: async () => {
    set({ isFiltersLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const [deptResponse, domainResponse] = await Promise.all([
        fetch(`${API_URL}/departments/getDepartments`, { headers }),
        fetch(`${API_URL}/domains/`, { headers }),
      ]);

      if (!deptResponse.ok || !domainResponse.ok) {
        throw new Error("Failed to fetch filter data");
      }

      const deptsJson = await deptResponse.json();
      const domainsJson = await domainResponse.json();

      const formattedDepts = deptsJson.data.map((d: any) => ({
        abbreviation: d.dept_abbreviation,
        name: d.dept_name,
      }));

      const newDomainMapping: Record<string, Domains[]> = {};

      domainsJson.data.forEach((domain: any) => {
        const deptKey = domain.dept_abbreviation;

        if (!newDomainMapping[deptKey]) {
          newDomainMapping[deptKey] = [];
        }
        newDomainMapping[deptKey].push({
          domainId: domain.domain_id,
          domainName: domain.domain_name,
          domainDescription: domain.domain_description,
          deptAbbreviation: domain.dept_Abbreviation,
        });
      });

      set({
        departments: formattedDepts,
        domainMapping: newDomainMapping,
        isFiltersLoading: false,
      });
    } catch (error) {
      console.error("Error fetching filters:", error);
      set({ isFiltersLoading: false });
    }
  },
}));
