import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface Department {
  deptAbbreviation: string;
  deptName: string;
}

interface DepartmentDropdownProps {
  placeholder?: string;
  options: Department[];
  value: string;
  onChange: (deptAbbreviation: string) => void;
}

export default function DepartmentDropdown({
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
   opt.deptAbbreviation !== value &&
      ((opt.deptName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.deptAbbreviation || "").toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const selectedDepartment = options.find(
    (opt) => opt.deptAbbreviation === value,
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-md flex items-center gap-1.5 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all cursor-text shadow-sm"
      >
        {selectedDepartment && (
          <span className="flex items-center truncate bg-slate-100 text-slate-700 text-sm px-3 py-0.5 rounded ">
            {selectedDepartment.deptAbbreviation} -{" "}
            {selectedDepartment.deptName}
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
          className="flex-1 bg-transparent min-w-[50px] outline-none text-sm text-slate-700 placeholder:text-slate-400 px-1"
        />

        <ChevronDown
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-4 h-4 shrink-0 text-slate-400 ml-auto cursor-pointer"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto py-1">
          {availableOptions.length > 0 ? (
            availableOptions.map((opt) => (
              <div
                key={opt.deptAbbreviation}
                className="px-3 py-2 text-sm text-brand hover:bg-brand/10 cursor-pointer transition-colors"
                onClick={() => {
                  onChange(opt.deptAbbreviation);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                <span className="font-medium mr-1">{opt.deptAbbreviation}</span>
                <span className="text-slate-500 truncate">
                  - {opt.deptName}
                </span>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-400 italic">
              No departments found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// TODO : will make the design minimalist this is very awkward  //done
