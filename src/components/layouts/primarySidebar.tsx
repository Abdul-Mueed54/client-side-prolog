"use client";

import React, { useEffect, useMemo } from "react";
import { Funnel, Check } from "lucide-react";
import { useFilterStore } from "../../store/useFilterStore";
import { UniversalDropdown } from "../dropDown/universalDropDown";

// --- MASTER DATA ---
const DEPARTMENTS = [
  "TE - Textile Engineering",
  "TS - Textile Sciences",
  "CIS - Computer & Info Systems",
  "SE - Software Engineering",
];

// FIX 1: Made this an actual Record (Object) so your cascading logic works!
const DOMAIN_MAPPING: Record<string, string[]> = {
  "TE - Textile Engineering": ["Yarn Manufacturing", "Polymer Science"],
  "TS - Textile Sciences": ["Quality Control"],
  "CIS - Computer & Info Systems": ["AI/ML", "Web Dev", "Data Science"],
  "SE - Software Engineering": ["AI/ML", "Cyber Security", "Web Dev"],
};

const INDUSTRIES = ["Industry-Linked", "Received Grant"];
const YEARS = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022"];

export default function PrimarySidebar() {
  const store = useFilterStore();

  // 1. Cascading Logic: Filter domains based on selected department
  const availableDomains = useMemo(() => {
    const dept = store.selectedDepartment;
    if (!dept) {
      // If no dept selected, show all unique domains across all departments
      return Array.from(new Set(Object.values(DOMAIN_MAPPING).flat())).sort();
    }
    // Return domains specifically for the single selected department
    return DOMAIN_MAPPING[dept] || [];
  }, [store.selectedDepartment]);
  // 2. Safety Cleanup: Automatically deselect domains that don't belong to the new department
  useEffect(() => {
    // Filter the currently selected domains to only keep ones that are still valid
    const validSelectedDomains = store.selectedDomains.filter((dom) =>
      availableDomains.includes(dom)
    );

    // If the length changed, it means some invalid domains were removed, 
    // so we update the store to clear them out of the UI.
    if (validSelectedDomains.length !== store.selectedDomains.length) {
      store.setDomains(validSelectedDomains);
    }
  }, [availableDomains, store.selectedDomains, store.setDomains]);

  const hasActiveFilters =
    !!store.selectedDepartment ||
    store.selectedDomains.length > 0 ||
    store.selectedIndustries.length > 0 ||
    store.selectedYears.length > 0;

  return (
    <aside className="w-64 h-screen bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
      <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-5 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-700 text-xl font-bold">
          <Funnel className="w-5 h-5 text-indigo-600" />
          <span className="tracking-tight">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={store.clearAll}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col p-5 gap-8">
        
        {/* DEPARTMENT: Single Select */}
        <UniversalDropdown
          label="Department"
          placeholder="Select department..."
          options={DEPARTMENTS}
          multiple={false} 
          searchable={true}
          value={store.selectedDepartment} 
          onChange={store.setDepartment}   
        />

        {/* DOMAINS: Multi Select */}
        <UniversalDropdown
          label="Domains"
          placeholder="Select domains..."
          options={availableDomains}   
          multiple={true}   
          searchable={true}            
          value={store.selectedDomains} 
          onChange={store.setDomains}   
        />

        {/* INDUSTRIES: Checkboxes */}
        <FilterCheckboxGroup
          label="Industry"
          options={INDUSTRIES}
          selectedItems={store.selectedIndustries}
          onChange={store.setIndustries} 
        />

        {/* YEARS: Checkboxes */}
        <FilterCheckboxGroup
          label="Academic Year"
          options={YEARS}
          selectedItems={store.selectedYears}
          onChange={store.setYears} 
        />
      </div>
    </aside>
  );
}

// --- REUSABLE COMPONENTS ---

// FIX 3: Updated to use `onChange(newArray)` to match UniversalDropdown and Zustand perfectly
function FilterCheckboxGroup({ 
  label, 
  options, 
  selectedItems, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selectedItems: string[]; 
  onChange: (newArray: string[]) => void 
}) {
  
  // This little function handles adding/removing from the array
  const handleToggle = (opt: string) => {
    if (selectedItems.includes(opt)) {
      onChange(selectedItems.filter(item => item !== opt)); // Remove
    } else {
      onChange([...selectedItems, opt]); // Add
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-slate-500 text-sm font-bold uppercase tracking-widest">{label}</label>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const checked = selectedItems.includes(opt);
          return (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? "bg-indigo-600 border-indigo-700 text-white" : "bg-white border-slate-300 group-hover:border-slate-400"}`}>
                {checked && <Check className="w-3 h-3" strokeWidth={4} />}
              </div>
              <input type="checkbox" className="hidden" checked={checked} onChange={() => handleToggle(opt)} />
              <span className={`text-sm font-medium ${checked ? "text-slate-900" : "text-slate-600"}`}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}