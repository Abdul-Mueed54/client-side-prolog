"use client";

import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";

export default function SecondarySidebar() {
  const { selectedProject } = useProjectDisplayStore();

  if (!selectedProject) {
    return (
      <aside className="w-80 min-w-80 max-w-80 h-screen flex items-center justify-center text-center bg-white border-l border-slate-200">
        <p className="text-sm text-slate-400 font-medium px-4">
          Select a project to view details
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 min-w-80 max-w-80 h-screen flex flex-col bg-white border-l border-slate-200">
      
      <div className="flex-1 min-w-0 overflow-y-auto p-8 flex flex-col gap-8">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-2">
            Title
          </h2>
          <p className="text-slate-800 text-lg font-bold leading-snug break-words">
            {selectedProject.title}
          </p>
        </div>

        <div className="min-w-0 flex flex-col max-h-64">
          <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-2">
            Abstract
          </h2>
          <div className="overflow-y-auto pr-2 text-slate-600 text-sm leading-relaxed break-words">
            {selectedProject.abstract}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-2">
            Domains
          </h2>
          <div className="flex flex-col gap-1.5">
            {selectedProject.domains.map((domain) => (
              <span
                key={domain}
                className="text-slate-700 text-sm font-medium break-words"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 min-w-0">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
              Supervisor
            </h2>
            <p className="text-sm font-medium text-slate-700 break-words">
              {selectedProject.supervisor}
            </p>
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
              Batch
            </h2>
            <p className="text-sm font-medium text-slate-700">
              {selectedProject.batch}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
