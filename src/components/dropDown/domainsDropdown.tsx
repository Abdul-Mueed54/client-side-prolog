import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { Domains } from "@/types";

interface DomainDropdownProps {
  label?: string;
  placeholder?: string;
  options: Domains[];
  value: string[]; // Strictly an array of IDs
  onChange: (ids: string[]) => void;
}

export default function DomainDropdown({
  label = "Domains",
  placeholder = "Select domains...",
  options = [],
  value = [],
  onChange,
}: DomainDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
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
      !value.includes(opt.domainId) &&
      opt.domainName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRemove = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== idToRemove));
  };

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col gap-2 relative ${isOpen ? "z-50" : "z-10"}`}
    >
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}

      <div className="relative z-20">
        <div
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
          className={`w-full min-h-[46px] p-2 bg-slate-50 border ${isOpen ? "border-[#EF9F27] ring-1 ring-[#EF9F27]" : "border-slate-200"} rounded-md flex flex-wrap gap-1.5 items-center transition-all cursor-text`}
        >
          {/* Render selected tags */}
          {value.map((id) => {
            const domainObj = options.find((opt) => opt.domainId === id);
            if (!domainObj) return null;

            return (
              <span
                key={id}
                className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm"
              >
                {domainObj.domainName}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={(e) => handleRemove(id, e)}
                />
              </span>
            );
          })}

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent min-w-[80px] outline-none text-sm text-slate-700 placeholder:text-slate-400"
            size={searchTerm.length === 0 ? 1 : searchTerm.length}
          />

          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`w-4 h-4 text-slate-400 ml-auto transition-transform cursor-pointer ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1">
            {availableOptions.length > 0 ? (
              availableOptions.map((opt) => (
                <div
                  key={opt.domainId}
                  className="px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-md cursor-pointer transition-colors"
                  onClick={() => {
                    onChange([...value, opt.domainId]); // Add ID to array
                    setSearchTerm("");
                    inputRef.current?.focus();
                  }}
                >
                  {opt.domainName}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-slate-400 text-center italic">
                No domains found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
