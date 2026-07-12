"use client";

import React, { useEffect, useMemo } from "react";
import { Funnel, Check, Loader2 } from "lucide-react";
import { useFilterStore } from "../../store/useFilterStore";
import DomainDropdown from "../dropDown/domainsDropdown";
import DepartmentDropdown from "../dropDown/departmentsDropdown";
import LogoutButton from "../logoutButton/logout";
import { ScrollArea } from "../ui/scroll-area";

export default function PrimarySidebar() {
  const store = useFilterStore();

  useEffect(() => {
    if (store.departments.length === 0) {
      store.fetchFilters();
    }
  }, [store.departments.length, store.fetchFilters]);

  const availableDomains = useMemo(() => {
    const dept = store.selectedDepartment;
    if (!dept) {
      const allDomains = Object.values(store.domainMapping).flat();
      return Array.from(
        new Map(allDomains.map((d) => [d.domainId, d])).values(),
      );
    }
    return store.domainMapping[dept] || [];
  }, [store.selectedDepartment, store.domainMapping]);

  useEffect(() => {
    const validSelectedDomains = store.selectedDomains.filter((domId) =>
      availableDomains.some((domainObj) => domainObj.domainId === domId),
    );
    if (validSelectedDomains.length !== store.selectedDomains.length) {
      store.setDomains(validSelectedDomains);
    }
  }, [availableDomains, store.selectedDomains, store.setDomains]);

  const hasActiveFilters =
    !!store.selectedDepartment ||
    store.selectedDomains.length > 0 ||
    store.selectedIndustries.length > 0 ||
    store.fromYear.length > 0 ||
    store.toYear.length > 0

  return (
    <aside className="w-64 h-156 bg-white border-r border-slate-200 flex flex-col">
      <ScrollArea className="flex-1 h-full">
        <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 text-xl font-bold">
            <Funnel className="w-5 h-5 text-brand" />
            <span className="tracking-tight">Filters</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={store.clearAll}
              className="text-[11px] uppercase font-bold text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {store.isFiltersLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 mt-10">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
              <span className="text-sm">Loading filters...</span>
            </div>
          ) : (
            <div className="flex flex-col p-5 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                  Department
                </label>
                <DepartmentDropdown
                  options={store.departments}
                  value={store.selectedDepartment}
                  onChange={store.setDepartment}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                  Domains
                </label>
                <DomainDropdown
                  options={availableDomains}
                  value={store.selectedDomains}
                  onChange={store.setDomains}
                />
              </div>


              <YearRangeFilter
                label="Academic Year"
                options={store.years}
                fromYear={store.fromYear}
                toYear={store.toYear}
                onChangeFrom={store.setFromYear}
                onChangeTo={store.setToYear}
              />
              <FilterCheckboxGroup
                label="Industry"
                options={store.industries}
                selectedItems={store.selectedIndustries}
                onChange={store.setIndustries}
              />
{/*
              <FilterCheckboxGroup
                label="Academic Batch"
                options={store.years}
                selectedItems={store.selectedYears}
                onChange={store.setYears}
              /> */}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 flex justify-center border-t border-slate-200 ">
        <LogoutButton />
      </div>
    </aside>
  );
}

function FilterCheckboxGroup({
  label,
  options,
  selectedItems,
  onChange,
}: {
  label: string;
  options: string[];
  selectedItems: string[];
  onChange: (newArray: string[]) => void;
}) {
  const handleToggle = (opt: string) => {
    if (selectedItems.includes(opt)) {
      onChange(selectedItems.filter((item) => item !== opt));
    } else {
      onChange([...selectedItems, opt]);
    }
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col gap-3 ">
        <label className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          {label}
        </label>
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => {
            const checked = selectedItems.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? "bg-brand border-black text-white" : "bg-white border-slate-300 group-hover:border-slate-400"}`}
                >
                  {checked && <Check className="w-3 h-3" strokeWidth={4} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => handleToggle(opt)}
                />
                <span
                  className={`text-sm font-medium ${checked ? "text-slate-900" : "text-slate-600"}`}
                >
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}


interface YearRangeFilterProps {
  label: string;
  options: string[]; 
  fromYear: string;
  toYear: string;
  onChangeFrom: (year: string) => void;
  onChangeTo: (year: string) => void;
}

export function YearRangeFilter({
  label,
  options,
  fromYear,
  toYear,
  onChangeFrom,
  onChangeTo,
}: YearRangeFilterProps) {
  // Ensure years are sorted logically (ascending)
  const sortedYears = [...options].sort((a, b) => Number(a) - Number(b));

  return (
    <div className="flex flex-col gap-3">
      <label className="text-slate-500 text-sm font-bold uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* From Year Dropdown */}
        <select
          value={fromYear}
          onChange={(e) => onChangeFrom(e.target.value)}
          className="w-full min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-md flex items-center gap-1.5 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all cursor-text text-sm text-slate-400 shadow-sm"
        >
          <option value="">From</option>
          {sortedYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <span className="text-slate-400 text-sm font-medium">to</span>

        {/* To Year Dropdown */}
        <select
          value={toYear}
          onChange={(e) => onChangeTo(e.target.value)}
          className="w-full min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-md flex items-center gap-1.5 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all cursor-text text-sm text-slate-400 shadow-sm"
        >
          <option value="">To</option>
          {sortedYears.map((year) => (
            <option
              key={year}
              value={year}
              // Disable years that are before the selected 'From' year
              disabled={fromYear ? Number(year) < Number(fromYear) : false}
            >
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}