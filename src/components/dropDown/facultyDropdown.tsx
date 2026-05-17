"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

import { Faculty } from "@/types";

interface FacultyDropdownProps {
  options: Faculty[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function FacultyDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select Faculty",
}: FacultyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.facultyId === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 text-sm rounded-md px-3 py-2.5 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
      >
        <span
          className={selected ? "text-slate-900 font-medium" : "text-slate-400"}
        >
          {selected ? selected.facultyName : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in">
          {options.length === 0 ? (
            <div className="p-3 text-sm text-slate-500 text-center">
              No faculty found
            </div>
          ) : (
            <div className="p-1">
              {options.map((opt) => (
                <button
                  key={opt.facultyId}
                  type="button"
                  onClick={() => {
                    onChange(opt.facultyId);
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                >
                  <span
                    className={
                      value === opt.facultyId
                        ? "font-semibold text-slate-900"
                        : "text-slate-600"
                    }
                  >
                    {opt.facultyName}
                  </span>
                  {value === opt.facultyId && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
