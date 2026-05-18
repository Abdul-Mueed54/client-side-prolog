"use client";

import React from "react";
import { Project } from "../../types";
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";
import { Award, Users, ChevronRight } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  const setSelectedProject = useProjectDisplayStore(
    (state) => state.setSelectedProject,
  );
  const selectedProject = useProjectDisplayStore(
    (state) => state.selectedProject,
  );

  const isSelected = selectedProject?.id === project.id;

  // Cleanly check if the project has any valid grants instead of mapping over them
  const isSponsored = project.grants && project.grants.length > 0;

  return (
    <div
      onClick={() => setSelectedProject(project)}
      className={`
        group flex flex-col h-full p-6 bg-white rounded-xl text-left cursor-pointer transition-all duration-200 border
        ${
          isSelected
            ? "border-brand shadow-md ring-1 ring-brand bg-orange-50/30 relative z-10"
            : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
        }
      `}
    >
      {/* Header: Title & Badge */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3
          className={`font-bold text-lg leading-tight line-clamp-2 transition-colors ${isSelected ? "text-slate-900" : "text-slate-800 group-hover:text-brand"}`}
        >
          {project.title}
        </h3>

        {isSponsored && (
          <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0 shadow-sm">
            <Award size={12} strokeWidth={2.5} />
            Sponsored
          </span>
        )}
      </div>

      {/* Domain Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.domains?.map((domain) => (
          <span
            key={domain}
            className="bg-green-100 text-slate-600 border border-slate-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
          >
            {domain}
          </span>
        ))}
      </div>

      {/* Abstract */}
      <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
        {project.abstract}
      </p>

      {/* Footer: Metadata & Action Arrow */}
      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex flex-col gap-1.5 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium truncate">
            <Users size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">
              {project.supervisors?.map((s) => s.name).join(", ") ||
                "Unassigned"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Batch {project.batch?.split("-")[0] || "N/A"} • {project.department}
          </span>
        </div>

        {/* Replaced the fake button with an elegant arrow indicator */}
        <div
          className={`
          flex items-center justify-center shrink-0 w-8 h-8 rounded-full transition-colors
          ${
            isSelected
              ? "bg-brand text-white"
              : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-brand"
          }
        `}
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
