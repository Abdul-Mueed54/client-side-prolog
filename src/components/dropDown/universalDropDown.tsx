import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface UniversalDropdownProps<T> {
  label?: string;
  placeholder?: string;
  options: T[];
  multiple?: boolean;
  searchable?: boolean;
  value: T[] | T | null | "";
  onChange: (newValue: any) => void;
  extractLabel?: (item: T) => string;
  extractKey?: (item: T) => string | number;
}

export function UniversalDropdown<T>({
  label,
  placeholder = "Select items...",
  options = [],
  multiple = false,
  searchable = false,
  value,
  onChange,
  extractLabel = (i) => String(i),
  extractKey = (i) => String(i),
}: UniversalDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Create refs for the container and the input
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is NOT inside our dropdown container, close it!
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Listen for mouse clicks anywhere on the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Clear search term when dropdown closes
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  const itemsArray = Array.isArray(value) ? value : value ? [value] : [];

  const availableOptions = options.filter((opt) => {
    const isSelected = itemsArray.some(
      (v) => extractKey(v) === extractKey(opt),
    );
    const matchesSearch = extractLabel(opt)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return !isSelected && matchesSearch;
  });

  const handleAdd = (item: T) => {
    if (multiple) {
      onChange([...itemsArray, item]);
      setSearchTerm("");
      inputRef.current?.focus();
    } else {
      onChange(item);
      setIsOpen(false);
    }
  };

  const handleRemove = (itemToRemove: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(
        itemsArray.filter((v) => extractKey(v) !== extractKey(itemToRemove)),
      );
    } else {
      onChange("");
    }
  };

  const handleContainerClick = () => {
    setIsOpen(true);
    if (searchable) inputRef.current?.focus();
  };

  return (
    // 3. Attach the ref to the outermost container
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
          {itemsArray.map((item) => (
            <span
              key={extractKey(item)}
              className= "flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm" 
            >
              {extractLabel(item)}
              <X
                className={`${multiple ?"w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" : "hidden"}`}
                onClick={(e) => handleRemove(item, e)}
              />
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            readOnly={!searchable}
            placeholder={itemsArray.length === 0 ? placeholder : ""}
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

        {/* 4. Removed the invisible <div className="fixed inset-0..." /> from here */}

        {isOpen && (
          // Bumped z-index to 50 just to be safe so it floats above everything else on your page
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1">
            {availableOptions.length > 0 ? (
              availableOptions.map((opt) => (
                <div
                  key={extractKey(opt)}
                  className="px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-md cursor-pointer transition-colors"
                  onClick={() => handleAdd(opt)}
                >
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
