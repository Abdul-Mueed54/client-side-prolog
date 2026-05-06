import { create } from "zustand";

interface FilterState {
  selectedDepartment: string;
  selectedDomains: string[];
  selectedIndustries: string[];
  selectedYears: string[];

  // 1. Replaced add/remove with simple "Setters"
  setDepartment: (dept: string) => void;
  setDomains: (domains: string[]) => void;
  
  // 2. We can do the same for checkboxes if they also return arrays, 
  // OR keep toggle if you are using standard single checkboxes
  setIndustries: (industries: string[]) => void;
  setYears: (years: string[]) => void;

  // Reset
  clearAll: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedDepartment: "",
  selectedDomains: [],
  selectedIndustries: [],
  selectedYears: [],

  // --- THE NEW ACTIONS ---
  // Just take the value and overwrite the state! So simple.

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
}));