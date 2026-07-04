import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { Domains } from "@/types";

interface DomainDropdownProps {
  placeholder?: string;
  options: Domains[];
  value: string[]; // Strictly an array of IDs
  onChange: (ids: string[]) => void;
}

export default function DomainDropdown({
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
    <div ref={dropdownRef} className="relative w-full z-20">
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="w-full min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-md flex flex-wrap gap-1.5 items-center focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all cursor-text shadow-sm"
      >
        {/* Render selected minimalist tags */}
        {value.map((id) => {
          const domainObj = options.find((opt) => opt.domainId === id);
          if (!domainObj) return null;

          return (
            <span
              key={id}
              className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-2 py-0.5 rounded"
            >
              {domainObj.domainName}
              <X
                className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors shrink-0"
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
          className="flex-1 bg-transparent min-w-[80px] outline-none text-sm text-slate-700 placeholder:text-slate-400 px-1"
          size={searchTerm.length === 0 ? 1 : searchTerm.length}
        />

        <ChevronDown
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-4 h-4 text-slate-400 ml-auto cursor-pointer"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto py-1">
          {availableOptions.length > 0 ? (
            availableOptions.map((opt) => (
              <div
                key={opt.domainId}
                className="px-3 py-2 text-sm text-slate-700 hover:bg-brand/10 cursor-pointer transition-colors"
                onClick={() => {
                  onChange([...value, opt.domainId]);
                  setSearchTerm("");
                  inputRef.current?.focus();
                }}
              >
                {opt.domainName}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-400 italic">
              No domains found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
