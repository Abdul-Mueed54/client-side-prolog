"use client";

import {
  Paperclip,
  Download,
  FileText,
  FileArchive,
  File
} from "lucide-react";
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function SecondarySidebar() {
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

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, closeSidebar]);

  if (!selectedProject) {
    return (
      <aside className="w-80 min-w-80 max-w-80 h-screen flex items-center justify-center text-center bg-white border-l border-slate-200">
        <p className="text-sm text-slate-500 font-medium px-4">
          Select a project to view details
        </p>
      </aside>
    );
  }

  return (
    <aside
      ref={sideBarRef}
      className="w-80 min-w-80 max-w-80 h-screen flex flex-col bg-white border-l border-slate-200"
    >
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
              <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                <Paperclip size={16} /> Resources
              </h2>

              {selectedProject.resources && selectedProject.resources.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {selectedProject.resources.map((res: any, idx: number) => {

                    // Determine file type for styling
                    const isZip = res.type === 'application/zip';
                    const isPdf = res.type === 'application/pdf';

                    // Select appropriate icon
                    const FileIcon = isZip ? FileArchive : isPdf ? FileText : File;

                    // Select appropriate color theme
                    const iconColor = isZip
                      ? 'bg-amber-100 text-amber-600'
                      : isPdf
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-200 text-slate-600';

                    return (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={res.name} // Prompts browser to download rather than navigate
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-[#EF9F27] hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`p-2.5 rounded-lg ${iconColor}`}>
                            <FileIcon size={18} strokeWidth={2} />
                          </div>
                          <div className="flex flex-col truncate pr-2">
                            <span className="text-sm font-bold text-slate-700 truncate group-hover:text-[#EF9F27] transition-colors">
                              {res.name || `Resource File ${idx + 1}`}
                            </span>
                            <span className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
                              {isZip ? 'ZIP Archive' : isPdf ? 'PDF Document' : 'File'}
                            </span>
                          </div>
                        </div>
                        <div className="p-1.5 text-slate-400 group-hover:text-[#EF9F27] group-hover:bg-orange-50 rounded-md transition-colors">
                          <Download size={16} strokeWidth={2.5} />
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-500 italic">
                    No resources attached to this project.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}