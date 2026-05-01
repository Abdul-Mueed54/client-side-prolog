"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Funnel, X, ChevronDown, Check } from "lucide-react";
import { useFilterStore } from "../../store/useFilterStore";

// --- MASTER DATA ---
const DEPARTMENTS = [
  "TE - Textile Engineering",
  "TS - Textile Sciences",
  "CIS - Computer & Info Systems",
  "SE - Software Engineering",
];

const DOMAIN_MAPPING: Record<string, string[]> = {
  "TE - Textile Engineering": ["Yarn Manufacturing", "Polymer Science", "AI/ML", "Quality Control"],
  "TS - Textile Sciences": ["Smart Textiles", "Chemical Processing", "Sustainability"],
  "CIS - Computer & Info Systems": ["AI/ML", "Web Dev", "Cloud Computing", "Embedded Systems", "FPGA"],
  "SE - Software Engineering": ["Web Dev", "App Dev", "Cyber Security", "AI/ML"],
};

const INDUSTRIES = ["Industry-Linked", "Received Grant"];
const YEARS = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022"];

export default function PrimarySidebar() {
  const store = useFilterStore();

  // 1. Cascading Logic: Filter domains based on selected department
  const availableDomains = useMemo(() => {
    const dept = store.selectedDepartment;
    if (!dept) {
      return Array.from(new Set(Object.values(DOMAIN_MAPPING).flat())).sort();
    }
    // If it's a string, wrap in array to use same logic; if array, use as is
    const depts = Array.isArray(dept) ? dept : [dept];
    const union = new Set<string>();
    depts.forEach((d) => DOMAIN_MAPPING[d]?.forEach((dom) => union.add(dom)));
    return Array.from(union).sort();
  }, [store.selectedDepartment]);

  // 2. Safety: Remove domains that are no longer valid for the selected department
  useEffect(() => {
    store.selectedDomains.forEach((dom) => {
      if (!availableDomains.includes(dom)) store.removeDomain(dom);
    });
  }, [availableDomains, store]);

  const hasActiveFilters =
    (Array.isArray(store.selectedDepartment) ? store.selectedDepartment.length > 0 : !!store.selectedDepartment) ||
    store.selectedDomains.length > 0 ||
    store.selectedIndustries.length > 0 ||
    store.selectedYears.length > 0;

  return (
    <aside className="w-64 h-screen bg-pwhite border-r border-slate-d flex flex-col overflow-y-auto">
      <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-5 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-700 text-xl font-bold">
          <Funnel className="w-5 h-5 text-indigo-600" />
          <span className="tracking-tight">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={store.clearAll}
            className="text-[10px] uppercase font-bold text-slate-l hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col p-5 gap-8">
        <FilterDropdown
          label="Department"
          placeholder="Select department..."
          options={DEPARTMENTS}
          selectedItems={store.selectedDepartment}
          onAdd={store.addDepartment}
          onRemove={store.removeDepartment}
          extractLabel={(item) => item}
        />

        <FilterDropdown
          label="Domain"
          placeholder="Select domains..."
          options={availableDomains}
          selectedItems={store.selectedDomains}
          onAdd={store.addDomain}
          onRemove={store.removeDomain}
        />

        <FilterCheckboxGroup
          label="Industry"
          options={INDUSTRIES}
          selectedItems={store.selectedIndustries}
          onToggle={store.toggleIndustry}
        />

        <FilterCheckboxGroup
          label="Academic Year"
          options={YEARS}
          selectedItems={store.selectedYears}
          onToggle={store.toggleYear}
        />
      </div>
    </aside>
  );
}

// --- REUSABLE COMPONENTS ---

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedItems: string | string[]; // Support for single string or array
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
  extractLabel?: (val: string) => string;
}

function FilterDropdown({ label, placeholder, options, selectedItems, onAdd, onRemove, extractLabel = (i) => i }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize to array for the UI loop
  const items = Array.isArray(selectedItems)
    ? selectedItems
    : selectedItems ? [selectedItems] : [];

  const availableOptions = options.filter(opt => !items.includes(opt));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-l text-sm font-bold uppercase tracking-widest">{label}</label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[40px] p-1.5 bg-slate-50 border border-slate-l rounded-lg flex flex-wrap gap-1.5 items-center cursor-pointer hover:border-indigo-400 transition-all"
        >
          {items.length === 0 && <span className="text-sm text-slate-400 ml-1">{placeholder}</span>}
          {items.map((item) => (
            <span key={item} className="flex items-center gap-1 bg-indigo-l border border-indigo-m text-indigo-d text-xs font-semibold px-2 py-1 rounded-md">
              {extractLabel(item)}
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemove(item); }} />
            </span>
          ))}
          <ChevronDown className={`w-4 h-4 text-slate-l ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>

        {isOpen && availableOptions.length > 0 && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
              {availableOptions.map((opt) => (
                <div
                  key={opt}
                  className="p-2.5 text-sm text-slate-m hover:bg-indigo-l hover:text-indigo-d cursor-pointer transition-colors"
                  onClick={() => { onAdd(opt); setIsOpen(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterCheckboxGroup({ label, options, selectedItems, onToggle }: { label: string; options: string[]; selectedItems: string[]; onToggle: (i: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-slate-l text-sm font-bold uppercase tracking-widest">{label}</label>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const checked = selectedItems.includes(opt);
          return (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? "bg-brand border-slate-d text-white" : "bg-white border-slate-l group-hover:border-slate-m"}`}>
                {checked && <Check className="w-3 h-3" strokeWidth={4} />}
              </div>
              <input type="checkbox" className="hidden" checked={checked} onChange={() => onToggle(opt)} />
              <span className={`text-sm font-medium ${checked ? "text-slate-900" : "text-slate-600"}`}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}