"use client";

import { Link } from "lucide-react"; // Removed 'Send' since comments are gone
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function SecondarySidebar() {
  // 1. Hooks MUST be called inside the component
  const { role } = useAuthStore();
  const { selectedProject, closeSidebar } = useProjectDisplayStore();

  const sideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    // Listen for mouse clicks anywhere and esc key
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, closeSidebar]);

  // The Empty State
  if (!selectedProject) {
    return (
      <aside className="w-80 min-w-80 max-w-80 h-screen flex items-center justify-center text-center bg-white border-l border-slate-200">
        <p className="text-sm text-slate-500 font-medium px-4">
          Select a project to view details
        </p>
      </aside>
    );
  }

  // The Populated State
  return (
    <aside
      ref={sideBarRef}
      className="w-80 min-w-80 max-w-80 h-screen flex flex-col bg-white border-l border-slate-200"
    >
      {/* Scrollable Padding Container */}
      <div className="flex-1 min-w-0 overflow-y-auto p-8 flex flex-col gap-8">

        {/* Title Section */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">
            Title
          </h2>
          <p className="text-black text-lg font-bold leading-snug break-words">
            {selectedProject.title}
          </p>
        </div>

        {/* Abstract Section */}
        <div className="min-w-0 flex flex-col max-h-64">
          <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">
            Abstract
          </h2>
          <div className="overflow-y-auto pr-2 text-black text-sm leading-relaxed break-words">
            {selectedProject.abstract}
          </div>
        </div>

        {/* Domains Section */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">
            Domains
          </h2>
          <div className="flex flex-col gap-1.5">
            {selectedProject.domains?.map((domain: string) => (
              <span
                key={domain}
                className="text-black text-sm font-medium break-words"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Data Section */}
        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 min-w-0">
          <div>
            <h2 className="text-sm font-bold text-slate-500 tracking-widest mb-2 uppercase">
              SUPERVISOR(s)
            </h2>
            <div className="flex flex-col text-sm font-medium text-black break-words">
              {selectedProject.supervisors && selectedProject.supervisors.length > 0
                ? selectedProject.supervisors.map((n: any, index: number) => (
                    <span key={index}>{n.name}</span>
                  ))
                : "None assigned"}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">
              Department
            </h2>
            <p className="text-sm font-medium text-black break-words">
              {selectedProject.department}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">
              Batch
            </h2>
            <p className="text-sm font-medium text-black">
              {selectedProject.batch}
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* 🔐 FACULTY & ADMIN ONLY SECTION           */}
        {/* ========================================= */}
        {(role === "faculty" || role === "admin") && (
          <div className="pt-6 border-t border-slate-200 flex flex-col gap-8 w-full mt-4 pb-12">
            <div className="w-full">
              <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-2 flex items-center gap-2">
                <Link size={16} /> Resources
              </h2>

              {selectedProject.resources && selectedProject.resources.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {selectedProject.resources.map((res: any, idx: number) => (
                    <a
                      key={idx}
                      href={res.projectReport} // URL from backend
                      target="_blank" // Opens file in a new tab safely
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-words font-medium transition-colors"
                    >
                      {res.other || `Project Resource File ${idx + 1}`}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No resources attached to this project.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}