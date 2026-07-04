"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../searchBar/SearchBar";
import ProjectCard from "../projects/ProjectCard";
import { useDebounce } from "../../hooks/useDebounce";
import { useProjectStore } from "@/store/useProjectStore";
import { useFilterStore } from "@/store/useFilterStore";
import LogoutButton from "../logoutButton/logout";
import { Loader } from "../loader/loader";
import { ScrollArea } from "../ui/scroll-area";

export default function MainWindow() {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    totalRecords = 0,
    fetchProjects,
    currentPage,
    totalPages,
    projects,
    error,
    isLoading,
  } = useProjectStore();

  const {
    selectedDepartment,
    selectedDomains,
    selectedIndustries,
    selectedYears,
  } = useFilterStore();

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    // Any time filters or search change, drop back to page 1
    fetchProjects(1, debouncedSearch);
  }, [
    isHydrated,
    debouncedSearch,
    fetchProjects,
    selectedDepartment,
    selectedDomains,
    selectedIndustries,
    selectedYears,
  ]);

  return (
    <ScrollArea className="flex-1 h-full">

    <div className="h-[700px]">
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="mb-6">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <strong className="text-brand/700">{totalRecords}</strong>{" "}
              Projects Found
            </>
          )}

      </div>

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md border border-red-100">
          Error: {error}
        </div>
      )}

      {/* Grid Container */}
      <div className="flex-1 p-2">
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {/* Pagination Controls */}
        {!isLoading && projects.length > 0 && (
          <div className="flex-none flex justify-between items-center pt-4 pb-4 border-t border-slate-200 mt-4">
            <button
              onClick={() => fetchProjects(currentPage - 1, debouncedSearch)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-slate-100 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => fetchProjects(currentPage + 1, debouncedSearch)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-slate-100 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </ScrollArea>
  );
}
