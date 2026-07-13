"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface External {
  extEmail: string;
  extName: string;
}

interface ExternalDropdownProps {
  options: External[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ExternalSupervisorDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select Supervisor...",
}: ExternalDropdownProps) {
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
      opt.extEmail !== value &&
      (opt.extName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.extEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedSupervisor = options.find((opt) => opt.extEmail === value);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-md flex items-center gap-1.5 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all cursor-text shadow-sm"
      >
        {selectedSupervisor && (
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-2 py-0.5 rounded max-w-[calc(100%-2rem)]">
            <span className="truncate">
              {selectedSupervisor.extName} ({selectedSupervisor.extEmail})
            </span>
            <X
              className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
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
          placeholder={!selectedSupervisor ? placeholder : ""}
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
                key={opt.extEmail}
                className="px-3 py-2 text-sm text-slate-700 hover:bg-brand/10 cursor-pointer transition-colors truncate"
                onClick={() => {
                  onChange(opt.extEmail);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                {opt.extName} ({opt.extEmail})
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-400 italic">
              No supervisors found
            </div>
          )}
        </div>
      )}
    </div>
  );
}