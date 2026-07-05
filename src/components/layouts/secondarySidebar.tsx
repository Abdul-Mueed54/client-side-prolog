"use client";

import {
  Paperclip,
  Download,
  FileText,
  FileArchive,
  File,
  X,
} from "lucide-react";
import { useProjectDisplayStore } from "../../store/useProjectDisplayStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

// shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function SecondarySidebar() {
  const { role } = useAuthStore();
  const { selectedProject, closeSidebar } = useProjectDisplayStore();
  const sideBarRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar]);

  if (!selectedProject) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50/50">
        <p className="text-sm font-medium text-slate-400">
          Select a project to view details
        </p>
      </div>
    );
  }

  return (
    <div
      ref={sideBarRef}
      className="flex h-full flex-col bg-white overflow-hidden"
    >
      {/* Sticky Header with Close Button */}
      <div className="flex items-start justify-between border-b border-slate-100  p-6 pb-4">
        <div className="flex-1 pr-4">
          <p className="mb-1 text-xs font-bold tracking-widest text-[#EF9F27] uppercase">
            {selectedProject.department}
          </p>
          <h2 className="text-xl font-bold leading-tight text-slate-900 break-words">
            {selectedProject.title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSidebar}
          className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sleek Scrollable Content */}
      <ScrollArea className="flex-1 p-6 h-full">
        <div className="flex flex-col gap-8 py-6">
          {/* Abstract Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Abstract
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 break-words">
              {selectedProject.abstract}
            </p>
          </div>

          {/* Domains Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.domains?.map((domain: string) => (
                <Badge
                  key={domain}
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  {domain}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Supervisor(s)
              </h3>
              <div className="flex flex-col text-sm font-medium text-slate-900">
                {selectedProject.supervisors &&
                selectedProject.supervisors.length > 0 ? (
                  selectedProject.supervisors.map((n: any, index: number) => (
                    <span key={index}>{n.name}</span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">None assigned</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Batch
              </h3>
              <p className="text-sm font-medium text-slate-900">
                {selectedProject.batch}
              </p>
            </div>
          </div>

          {/* Faculty & Admin Resources Section */}
          {(role === "faculty" || role === "admin") && (
            <>
              <Separator className="bg-slate-100" />
              <div className="space-y-4 pb-60">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  <Paperclip className="h-4 w-4" /> Resources
                </h3>

                {selectedProject.resources &&
                selectedProject.resources.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {selectedProject.resources.map((res: any, idx: number) => {
                      const isZip = res.type === "application/zip";
                      const isPdf = res.type === "application/pdf";
                      const FileIcon = isZip
                        ? FileArchive
                        : isPdf
                          ? FileText
                          : File;

                      const iconColor = isZip
                        ? "bg-amber-100 text-amber-600"
                        : isPdf
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-600";

                      return (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={res.name}
                          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-[#EF9F27] hover:shadow-md"
                        >
                          <div className="flex items-center gap-3 overflow-hidden ">
                            <div className={`rounded-lg p-2.5 ${iconColor}`}>
                              <FileIcon className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col truncate pr-2">
                              <span className="truncate text-sm font-semibold text-slate-700 transition-colors group-hover:text-[#EF9F27]">
                                {res.name || `Resource File ${idx + 1}`}
                              </span>
                              <span className="mt-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                {isZip
                                  ? "ZIP Archive"
                                  : isPdf
                                    ? "PDF Document"
                                    : "File"}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md p-1.5 text-slate-400 transition-colors group-hover:bg-orange-50 group-hover:text-[#EF9F27]">
                            <Download className="h-4 w-4" strokeWidth={2.5} />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <p className="text-xs text-slate-500 italic">
                      No resources attached to this project.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
