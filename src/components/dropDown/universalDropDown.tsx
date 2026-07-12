import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface UniversalDropdownProps<T> {
  label?: string;
  placeholder?: string;
  options: T[];
  multiple?: boolean;
  searchable?: boolean;
  // UPDATE 1: value is now strictly the ID(s) stored in your Zustand state
  value: string[] | string | null | "" | number;
  onChange: (newValue: any) => void;
  extractLabel?: (item: T) => string;
  extractKey?: (item: T) => string;
}

export function UniversalDropdown<T>({
  label,
  placeholder = "Select items...",
  options = [],
  multiple = false,
  searchable = false,
  value,
  onChange,
  extractLabel = (i: any) => String(i.label || i.name || i), // Smart default fallback
  extractKey = (i: any) => String(i.value || i.id || i.abbreviation || i), // Smart default fallback
}: UniversalDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  // UPDATE 2: Standardize the value into an array of IDs
  const selectedKeys = Array.isArray(value) ? value : value ? [value] : [];

  // Filter out options that are already selected OR don't match the search
  const availableOptions = options.filter((opt) => {
    const isSelected = selectedKeys.includes(extractKey(opt)); // 1. Safely extract the label
    const rawLabel = extractLabel(opt);

    // 2. Fallback to an empty string if it's undefined or null
    const safeLabel = rawLabel ? String(rawLabel) : "";

    // 3. Now it is 100% safe to use .toLowerCase()
    const matchesSearch = safeLabel
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return !isSelected && matchesSearch;
  });

  const handleAdd = (item: T) => {
    const itemKey = extractKey(item);
    if (multiple) {
      onChange([...selectedKeys, itemKey]); // Pass the ID back to Zustand!
      setSearchTerm("");
      inputRef.current?.focus();
    } else {
      onChange(itemKey); // Pass the ID back to Zustand!
      setIsOpen(false);
    }
  };

  const handleRemove = (keyToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedKeys.filter((k) => k !== keyToRemove));
    } else {
      onChange("");
    }
  };

  const handleContainerClick = () => {
    setIsOpen(true);
    if (searchable) inputRef.current?.focus();
  };

  // UPDATE 3: Helper function to get the full object from just its ID
  const getSelectedObject = (key: string): T | undefined => {
    return options.find((opt) => extractKey(opt) === key);
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
          onClick={handleContainerClick}
          className={`w-full min-h-[46px] p-2 bg-slate-50 border ${isOpen ? "border-[#EF9F27] ring-1 ring-[#EF9F27]" : "border-slate-200"} rounded-md flex flex-wrap gap-1.5 items-center transition-all ${searchable ? "cursor-text" : "cursor-pointer"}`}
        >
          {/* UPDATE 4: Render the selected tags using the lookup helper */}
          {selectedKeys.map((key) => {
            const fullObject = getSelectedObject(key.toString());
            // If the object isn't in options yet (e.g., loading), just show the key
            const displayLabel = fullObject ? extractLabel(fullObject) : key;

            return (
              <span
                key={key}
                className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm"
              >
                {displayLabel}
                <X
                  className={`${multiple ? "w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" : "hidden"}`}
                  onClick={(e) => handleRemove(key.toString(), e)}
                />
              </span>
            );
          })}

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            readOnly={!searchable}
            placeholder={selectedKeys.length === 0 ? placeholder : ""}
            className={`flex-1 bg-transparent min-w-[80px] outline-none text-sm text-slate-700 placeholder:text-slate-400 ${!searchable ? "cursor-pointer caret-transparent" : ""}`}
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

        {availableOptions.length > 0 ? (
          // 1. Add 'index' as the second parameter here
          availableOptions.map((opt, index) => (
            <div
              // 2. Append the index to the extracted key to guarantee uniqueness
              key={`${extractKey(opt)}-${index}`}
              className="px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-md cursor-pointer transition-colors"
              onClick={() => handleAdd(opt)}
            >
              {extractLabel(opt)}
            </div>
          ))
        ) : (
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1">
            {availableOptions.length > 0 ? (
              availableOptions.map((opt) => (
                <div
                  key={extractKey(opt)}
                  className="px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-md cursor-pointer transition-colors"
                  onClick={() => handleAdd(opt)}
                >
                  {/* Render the human-readable label in the dropdown list */}
                  {extractLabel(opt)}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-slate-400 text-center italic">
                No options found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
