import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react"; // <-- IMPORT X HERE
import { Departments } from "@/types";

interface DepartmentDropdownProps {
  label?: string;
  placeholder?: string;
  options: Departments[];
  value: string;
  onChange: (abbreviation: string) => void;
}

export default function DepartmentDropdown({
  label = "Department",
  placeholder = "Select department...",
  options = [],
  value,
  onChange,
}: DepartmentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableOptions = options.filter(
    (opt) =>
      opt.abbreviation !== value &&
      (opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const selectedDepartment = options.find((opt) => opt.abbreviation === value);

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col gap-2 relative ${isOpen ? "z-50" : "z-10"}`}
    >
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest text-break">
          {label}
        </label>
      )}

      <div className="relative z-20">
        <div
          onClick={() => setIsOpen(true)}
          className={`w-full min-h-[46px] p-2 bg-slate-50 border ${isOpen ? "border-[#EF9F27] ring-1 ring-[#EF9F27]" : "border-slate-200"} rounded-md flex items-center transition-all cursor-text`}
        >
          {/* FIXED: UI Overflow and Unselect Logic */}
          {selectedDepartment && (
            <span className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm max-w-[calc(100%-2rem)]">
              {/* The truncate class handles the "..." overflow */}
              <span className="truncate">
                <strong className="font-bold">
                  {selectedDepartment.abbreviation}
                </strong>{" "}
                - {selectedDepartment.name}
              </span>

              {/* The X button clears the selection */}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors shrink-0"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the dropdown from opening
                  onChange(""); // Clears the value in Zustand!
                  setSearchTerm("");
                }}
              />
            </span>
          )}

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder={!selectedDepartment ? placeholder : ""}
            // min-w-[20px] ensures it shrinks properly when a long tag is selected
            className="flex-1 bg-transparent min-w-[20px] outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />

          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`w-4 h-4 shrink-0 text-slate-400 ml-auto transition-transform cursor-pointer ${isOpen && "rotate-180"}`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1">
            {availableOptions.length > 0 ? (
              availableOptions.map((opt) => (
                <div
                  key={opt.abbreviation}
                  className="px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-md cursor-pointer transition-colors flex items-center"
                  onClick={() => {
                    onChange(opt.abbreviation);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                >
                  <span className="font-bold text-indigo-600 mr-1">
                    {opt.abbreviation}
                  </span>
                  <span className="text-slate-400 mr-1">-</span>
                  <span className="truncate">{opt.name}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-slate-400 text-center italic">
                No departments found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
