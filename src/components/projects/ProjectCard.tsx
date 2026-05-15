"use client";
import React from "react";
import { Project } from "../../types";
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";

export default function ProjectCard({ project }: { project: Project }) {
  const setSelectedProject = useProjectDisplayStore(
    (state) => state.setSelectedProject,
  );
  const selectedProject = useProjectDisplayStore(
    (state) => state.selectedProject,
  );

  return (
    <div
      onClick={() => setSelectedProject(project)}
      className={`
        bg-white rounded-xl p-5 flex flex-col h-full transition-all duration-300 cursor-pointer
        ${
          selectedProject?.id === project.id
            ? // CHANGED: Replaced ring-indigo-700 with ring-brand
              "ring-2 ring-brand shadow-2xl scale-[1.02] z-10 relative"
            : "shadow-sm border border-slate-200 hover:shadow-md opacity-80 hover:opacity-100"
        }
      `}
    >
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="font-bold text-slate-800 text-lg leading-tight">
          {project.title}
        </h3>
        <div className="">
          {project.grants?.map((grant) =>
            grant.name ? (
              <span
                key={grant.name}
                className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shrink-0"
              >
                Sponsored
              </span>
            ) : (
              <div></div>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.domains.map((domain) => (
          <span
            key={domain}
            // CHANGED: Using brand color with opacity for a soft badge look
            className="bg-pink-400 text-black border border-pink-50 text-xs font-semibold px-2 py-0.5 rounded-md"
          >
            {domain}
          </span>
        ))}
      </div>

      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
        {project.abstract}
      </p>

      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 font-medium">
            {project.supervisors?.map((s) => s.name).join(", ") ||
              "No Supervisor"}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            {/* CHANGED: Added the department right next to the batch! */}
            Batch {project.batch.split("-")[0]} • {project.department}
          </span>
        </div>

        {/* CHANGED: Replaced the blue button with your brand color */}
        <div className="bg-brand hover:opacity-90 text-white text-xs font-bold py-1.5 px-4 rounded-md transition-opacity pointer-events-none">
          Details
        </div>
      </div>
    </div>
  );
}
