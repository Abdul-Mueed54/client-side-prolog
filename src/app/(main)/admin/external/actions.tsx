"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { useExternalStore } from "@/store/useExternalStore";
import { useIndustryStore } from "@/store/useIndustryStore";
import { Externals } from "@/types"; // Pulls in your updated interface

interface ExternalActionsProps {
  external: Externals;
}

export function ExternalActions({ external }: ExternalActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
            <DropdownMenuLabel className="text-orange-400 font-bold">
              Actions
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(external.extEmail);
              toast.success("External Email copied!");
            }}
          >
            Copy Email ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setIsEditOpen(true), 50);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => {
              setTimeout(() => setIsDeleteOpen(true), 50);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditExternalDialog
        external={external}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteExternalDialog
        external={external}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditExternalDialogProps {
  external: Externals;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditExternalDialog({
  external,
  open,
  onOpenChange,
}: EditExternalDialogProps) {
  const updateExternal = useExternalStore((state) => state.updateExternal);
  const { industries, fetchIndustries } = useIndustryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (industries.length === 0 && open) {
      fetchIndustries();
    }
  }, [industries.length, fetchIndustries, open]);

  // Derived State: Find the name if we only have the ID from the table row
  const initialIndustryName =
    external.industryName ||
    industries.find((i) => i.industryId === external.industryId)
      ?.industryName ||
    "";

  // State only tracks what the user changes
  const [formData, setFormData] = useState({
    extName: external.extName || "",
    extEmail: external.extEmail || "",
    extDesignation: external.extDesignation || "",
    industryName: external.industryName || "",
  });

  // The actual value shown in the dropdown
  const currentIndustryName = formData.industryName || initialIndustryName;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalPayload = {
        extName: formData.extName,
        extDesignation: formData.extDesignation,
        industryName: currentIndustryName,
      };

      await updateExternal(external.extEmail, finalPayload);
      onOpenChange(false);
      toast.success("External supervisor updated successfully!");
    } catch (error: any) {
      console.error("Failed to update external supervisor:", error);
      toast.error(error.message || "Failed to update supervisor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit External Supervisor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="extName"
              value={formData.extName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address (ID)
            </label>
            <input
              disabled
              type="email"
              name="extEmail"
              value={formData.extEmail}
              className="w-full p-2 border border-slate-200 rounded-md outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Primary email identifiers cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Designation
            </label>
            <input
              required
              type="text"
              name="extDesignation"
              value={formData.extDesignation}
              onChange={handleChange}
              placeholder="e.g. Senior Engineer"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Industry
            </label>
            <select
              required
              name="industryName"
              value={currentIndustryName}
              onChange={handleChange}
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="" disabled>
                Select an Industry
              </option>
              {industries.map((ind) => (
                <option key={ind.industryId} value={ind.industryName}>
                  {ind.industryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-slate-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// DELETE DIALOG COMPONENT
// ============================================================================
interface DeleteExternalDialogProps {
  external: Externals;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteExternalDialog({
  external,
  open,
  onOpenChange,
}: DeleteExternalDialogProps) {
  const deleteExternal = useExternalStore((state) => state.deleteExternal);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExternal(external.extEmail);
      onOpenChange(false);
      toast.success(`${external.extName} has been deleted.`);
    } catch (error: any) {
      console.error("Failed to delete external supervisor:", error);
      toast.error(error.message || "Failed to delete supervisor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {external.extName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete the supervisor{" "}
            <strong>{external.extName}</strong>? This action cannot be undone
            and may affect active projects they are evaluating.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
