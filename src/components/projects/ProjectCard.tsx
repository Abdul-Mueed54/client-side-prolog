"use client";
import React from "react";
import { Project } from "../../types";
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";

import { DetailsButton } from "./ProjectDetailsButton";

export default function ProjectCard({ project }: { project: Project }) {
  // 2. Grab the setter function from Zustand
  const setSelectedProject = useProjectDisplayStore(
    (state) => state.setSelectedProject,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col h-full hover:shadow-md transition-shadow">
      {" "}
      {/* Header: Title & Badge */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="font-bold text-slate-800 text-lg leading-tight">
          {project.title}
        </h3>
        {project.isSponsored && (
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
            Sponsored
          </span>
        )}
      </div>
      {/* Domains (Capsules) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.domains.map((domain) => (
          <span
            key={domain}
            className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2 py-0.5 rounded-md"
          >
            {domain}
          </span>
        ))}
      </div>
      {/* Abstract */}
      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
        {project.abstract}
      </p>
      {/* Footer: Meta & Button */}
      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 font-medium">
            {project.supervisor}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Batch {project.batch.split("-")[0]}{" "}
            {/* Turns "2025-2026" into "2025" */}
          </span>
        </div>
        <div
          onClick={() => setSelectedProject(project)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 rounded-md transition-colors hover:cursor-pointer"
        >
          Details
        </div>
      </div>
    </div>
  );
}
