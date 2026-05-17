"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

import { Groups } from "@/types";

interface GroupDropdownProps {
  options: Groups[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function GroupDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select Group",
}: GroupDropdownProps) {
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

  const selected = options.find((opt) => opt.groupId === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 text-slate-700 text-sm rounded-md px-3 py-2.5 shadow-sm hover:bg-slate-50 transition-all"
      >
        <span
          className={selected ? "text-slate-900 font-medium" : "text-slate-400"}
        >
          {selected ? selected.groupId : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.groupId}
                type="button"
                onClick={() => {
                  onChange(opt.groupId);
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-slate-100"
              >
                <span
                  className={
                    value === opt.groupId
                      ? "font-semibold text-slate-900"
                      : "text-slate-600"
                  }
                >
                  {opt.groupId}
                </span>
                {value === opt.groupId && (
                  <Check className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
