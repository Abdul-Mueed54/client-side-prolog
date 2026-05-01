"use client";

import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, MessageSquare, Send } from "lucide-react"; // <-- Added 'Send' here!

export default function SecondarySidebar() {
  const { selectedProject } = useProjectDisplayStore();
  const { role } = useAuthStore();

  // The Empty State
  if (!selectedProject) {
    return (
      <aside className="w-80 min-w-80 max-w-80 h-screen flex items-center justify-center text-center bg-white border-l border-slate-d">
        <p className="text-sm text-slate-l font-medium px-4">
          Select a project to view details
        </p>
      </aside>
    );
  }

  // The Populated State
  return (
    <aside className="w-80 min-w-80 max-w-80 h-screen flex flex-col bg-white border-l border-slate-d">
      {/* Scrollable Padding Container */}
      <div className="flex-1 min-w-0 overflow-hidden overflow-scroll p-8 flex flex-col gap-8">
        {/* Title Section */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2">
            Title
          </h2>
          <p className="text-black text-lg font-bold leading-snug break-words">
            {selectedProject.title}
          </p>
        </div>

        {/* Abstract Section */}
        <div className="min-w-0 flex flex-col max-h-64">
          <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2">
            Abstract
          </h2>
          <div className="overflow-y-auto pr-2 text-black text-sm leading-relaxed break-words">
            {selectedProject.abstract}
          </div>
        </div>

        {/* Domains Section */}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2">
            Domains
          </h2>
          <div className="flex flex-col gap-1.5">
            {selectedProject.domains.map((domain) => (
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
            <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2">
              Supervisor
            </h2>
            <p className="text-sm font-medium text-black break-words">
              {selectedProject.supervisor}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2">
              Batch
            </h2>
            <p className="text-sm font-medium text-black">
              {selectedProject.batch}
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* 🔐 FACULTY ONLY SECTION                   */}
        {/* ========================================= */}
        {(role === "faculty" || role === "admin") && (
          <div className="pt-6 border-t border-slate-200 flex flex-col gap-8 w-full mt-4">
            {/* 1. Resources Area */}
            <div className="w-full">
              <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2 flex gap-2">
                <Link size={16} /> Resources
              </h2>
              {selectedProject.resources &&
              selectedProject.resources.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedProject.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.projectReport}
                      className="text-sm text-blue-600 hover:underline break-words font-medium"
                    >
                      {res.other}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-l italic">
                  No resources attached.
                </p>
              )}
            </div>

            {/* 2. Commenting Area */}
            <div className="w-full">
              <h2 className="text-sm font-bold text-slate-l tracking-widest uppercase mb-2 flex gap-2">
                <MessageSquare size={16} /> Faculty Notes
              </h2>

              {/* Comment Input Box */}
              <div className="relative mb-4">
                <textarea
                  placeholder="Any suggestion for the project above..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 text-sm text-slate-d resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="absolute bottom-3 right-3 text-indigo-700 hover:text-indigo-800 p-1 bg-indigo-50 rounded-md">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Comment List */}
        {role === "admin" && (
          <div className="flex flex-col gap-4 pb-20">
            {selectedProject.comment?.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100"
              >
                <p className="text-xs text-slate-m break-words">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
