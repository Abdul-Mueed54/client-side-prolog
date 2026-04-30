import { create } from "zustand";

interface FilterState {
  selectedDepartment: string ;
  selectedDomains: string[];
  selectedIndustries: string[];
  selectedYears: string[];

  // Dropdown Actions
  addDepartment: (dept: string) => void;
  removeDepartment: (dept: string) => void;
  addDomain: (domain: string) => void;
  removeDomain: (domain: string) => void;

  // Checkbox Actions
  toggleIndustry: (industry: string) => void;
  toggleYear: (year: string) => void;

  // Reset
  clearAll: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedDepartment: "",
  selectedDomains: [],
  selectedIndustries: [],
  selectedYears: [],

  addDepartment: (dept) => set({ selectedDepartment: dept }),

  removeDepartment: () =>
    set({
      selectedDepartment: "",
    }),

  addDomain: (domain) =>
    set((state) => ({
      selectedDomains: state.selectedDomains.includes(domain)
        ? state.selectedDomains
        : [...state.selectedDomains, domain],
    })),

  removeDomain: (domainToRemove) =>
    set((state) => ({
      selectedDomains: state.selectedDomains.filter(
        (domain) => domain !== domainToRemove,
      ),
    })),

  toggleIndustry: (industry) =>
    set((state) => ({
      selectedIndustries: state.selectedIndustries.includes(industry)
        ? state.selectedIndustries.filter((i) => i !== industry)
        : [...state.selectedIndustries, industry],
    })),

  toggleYear: (year) =>
    set((state) => ({
      selectedYears: state.selectedYears.includes(year)
        ? state.selectedYears.filter((y) => y !== year)
        : [...state.selectedYears, year],
    })),

  clearAll: () =>
    set({
      selectedDepartment: "",
      selectedDomains: [],
      selectedIndustries: [],
      selectedYears: [],
    }),
}));
