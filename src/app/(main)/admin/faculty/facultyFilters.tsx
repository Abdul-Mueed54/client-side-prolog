import React, { useState, useEffect, useMemo } from "react";
import { useDepartmentStore } from "@/store/useDeptStore";
import { X } from "lucide-react";
import DepartmentDropdown from "@/components/dropDown/departmentsDropdown";
import { useFacultyStore } from "@/store/useFacultyStore";

export default function FacultyFilters() {
  const fetchFaculty = useFacultyStore((state) => state.fetchFaculty);
  const { departments, fetchDepartments } = useDepartmentStore();

  const [selectedDept, setSelectedDept] = useState("");

  // Fetch departments on mount if missing
  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments]);

  const handleDeptChange = (newDept: string) => {
    setSelectedDept(newDept);
    fetchFaculty({ deptAbbreviation: newDept });
  };

  const clearFilters = () => {
    setSelectedDept("");
    fetchFaculty({});
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-[280px]">
        <DepartmentDropdown
          options={departments}
          value={selectedDept}
          onChange={handleDeptChange}
          placeholder="Filter by Department..."
        />
      </div>

      {selectedDept && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  );
}
