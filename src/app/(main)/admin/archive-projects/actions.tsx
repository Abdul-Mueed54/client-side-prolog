"use client";

import React, { useState } from "react";
import { MoreHorizontal, RefreshCcw, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useProjectStore } from "@/store/useProjectStore";
import { Project } from "@/types";

interface ProjectActionsProps {
  project: Project;
}

export function ArchiveProjectActions({ project }: ProjectActionsProps) {
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            variant: "ghost",
            className: "h-8 w-8 p-0",
          })}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-brand font-bold">
              Actions
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(project.id);
              toast.success("Project ID copied!");
            }}
          >
            <Copy className="mr-2 h-4 w-4 text-slate-500" />
            <span>Copy Project ID</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* RESTORE TRIGGER */}
          <DropdownMenuItem
            className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 cursor-pointer"
            onClick={() => {
              setTimeout(() => setIsRestoreOpen(true), 50);
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            <span>Restore Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DIALOG MOVED OUTSIDE THE MENU */}
      <RestoreProjectDialog
        project={project}
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
      />
    </>
  );
}

// RESTORE DIALOG INTERFACE
interface RestoreProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RestoreProjectDialog({
  project,
  open,
  onOpenChange,
}: RestoreProjectDialogProps) {
  const restoreProject = useProjectStore((state) => state.restoreProject);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreProject(project.id);
      onOpenChange(false);
      toast.success(`Project restored successfully.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to restore project.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore "{project?.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This will move the project back to the active directory. It will be visible in the main projects table again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRestore}
            disabled={isRestoring}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isRestoring ? "Restoring..." : "Restore Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}