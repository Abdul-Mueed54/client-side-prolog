"use client";

import React, { useState, useEffect } from "react";
import { Funnel, X, ChevronDown, Check } from "lucide-react";
import { useFilterStore } from "../../store/useFilterStore";

// --- MASTER DATA & MAPPING ---
const DEPARTMENTS = [
  "TE - Textile Engineering",
  "TS - Textile Sciences",
  "CIS - Computer & Info Systems",
  "SE - Software Engineering",
];

const DOMAIN_MAPPING: Record<string, string[]> = {
  "TE - Textile Engineering": [
    "Yarn Manufacturing",
    "Polymer Science",
    "AI/ML",
    "Quality Control",
  ],
  "TS - Textile Sciences": [
    "Smart Textiles",
    "Chemical Processing",
    "Sustainability",
  ],
  "CIS - Computer & Info Systems": [
    "AI/ML",
    "Web Dev",
    "Cloud Computing",
    "Embedded Systems",
    "FPGA",
  ],
  "SE - Software Engineering": [
    "Web Dev",
    "App Dev",
    "Cyber Security",
    "AI/ML",
  ],
};

const INDUSTRIES = ["Industry-Linked", "Received Grant"];
const YEARS = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022"];

export default function PrimarySidebar() {
  const store = useFilterStore();

  // --- CASCADING LOGIC ---
  // 1. Calculate which domains should be visible based on selected departments
  const availableDomains = React.useMemo(() => {
    if (store.selectedDepartments.length === 0) {
      // If no department selected, show ALL unique domains
      const allUniqueDomains = Array.from(
        new Set(Object.values(DOMAIN_MAPPING).flat()),
      );
      return allUniqueDomains.sort();
    }

    // Otherwise, show the union of domains for selected departments
    const union = new Set<string>();
    store.selectedDepartments.forEach((dept) => {
      DOMAIN_MAPPING[dept]?.forEach((domain) => union.add(domain));
    });
    return Array.from(union).sort();
  }, [store.selectedDepartments]);

  // 2. Safety Check: If a department is removed, remove any selected domains that are no longer available
  useEffect(() => {
    store.selectedDomains.forEach((selectedDomain) => {
      if (!availableDomains.includes(selectedDomain)) {
        store.removeDomain(selectedDomain);
      }
    });
  }, [availableDomains, store]);

  return (
    <aside className="w-64 h-screen bg-white border-r border-black flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-700 text-xl font-bold">
          <Funnel className="w-5 h-5 text-indigo-600" />
          <span className="tracking-tight">Filters</span>
        </div>

        {/* Quick clear button if filters are active */}
        {(store.selectedDepartments.length > 0 ||
          store.selectedDomains.length > 0 ||
          store.selectedIndustries.length > 0 ||
          store.selectedYears.length > 0) && (
          <button
            onClick={store.clearAll}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 tracking-wider transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col p-5 gap-8 ">
        {/* Departments Dropdown */}
        <FilterDropdown
          label="Department"
          placeholder="Select departments..."
          options={DEPARTMENTS}
          selectedItems={store.selectedDepartments}
          onAdd={store.addDepartment}
          onRemove={store.removeDepartment}
          extractLabel={(item) => item.split(" - ")[0]} // Renders "TE", "CIS"
        />

        {/* Domains Dropdown */}
        <FilterDropdown
          label="Domain"
          placeholder="Select domains..."
          options={availableDomains}
          selectedItems={store.selectedDomains}
          onAdd={store.addDomain}
          onRemove={store.removeDomain}
        />

        {/* Industry Checkboxes */}
        <FilterCheckboxGroup
          label="Industry"
          options={INDUSTRIES}
          selectedItems={store.selectedIndustries}
          onToggle={store.toggleIndustry}
        />

        {/* Academic Year Checkboxes */}
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

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================

// 1. Reusable Multi-Select Dropdown
function FilterDropdown({
  label,
  placeholder,
  options,
  selectedItems,
  onAdd,
  onRemove,
  extractLabel = (item) => item, // Default: show full text if no extractor provided
}: {
  label: string;
  placeholder: string;
  options: string[];
  selectedItems: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  extractLabel?: (item: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const availableOptions = options.filter(
    (opt) => !selectedItems.includes(opt),
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-400 text-[11px] font-bold tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[40px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 items-center cursor-pointer hover:border-[#EF9F27] hover:bg-white transition-all shadow-sm"
        >
          {selectedItems.length === 0 && (
            <span className="text-sm text-slate-400 ml-1 py-1 truncate">
              {placeholder}
            </span>
          )}

          {selectedItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-md"
            >
              {extractLabel(item)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                className="hover:bg-indigo-200 text-indigo-400 hover:text-indigo-800 rounded-full p-[1px] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 ml-auto mr-1 transition-transform ${
              isOpen ? "rotate-180 text-indigo-500" : ""
            }`}
          />
        </div>

        {isOpen && availableOptions.length > 0 && (
          <>
            {/* Invisible backdrop to close dropdown when clicking outside */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-52 overflow-y-auto">
              {availableOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onAdd(opt);
                    setIsOpen(false);
                  }}
                  className="p-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer border-b border-slate-50 last:border-0 font-medium transition-colors"
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

// 2. Reusable Checkbox Group
function FilterCheckboxGroup({
  label,
  options,
  selectedItems,
  onToggle,
}: {
  label: string;
  options: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-slate-400 text-[11px] font-bold tracking-widest uppercase">
        {label}
      </label>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const isChecked = selectedItems.includes(option);
          return (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer group "
            >
              <div
                className={`w-4 h-4 rounded-[4px] flex items-center border justify-center transition-all ${
                  isChecked
                    ? "bg-[#EF9F27] border-[#000000] text-white shadow-sm"
                    : "bg-white border-slate-300 group-hover:border-black"
                }`}
              >
                {isChecked && <Check className="w-3 h-3" strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={() => onToggle(option)}
              />
              <span
                className={`text-sm font-medium transition-colors ${isChecked ? "text-slate-800" : "text-slate-600 group-hover:text-slate-800"}`}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
