"use client";

import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

import { useIndustryStore } from "@/store/useIndustryStore";
import { Industry } from "@/types";

interface IndustryActionsProps {
  industry: Industry;
}

export function IndustryActions({ industry }: IndustryActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-orange-400 font-bold">Actions</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(industry.industryId);
              toast.success("Industry ID copied!");
            }}
          >
            Copy Industry ID
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

      <EditIndustryDialog
        industry={industry}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteIndustryDialog
        industry={industry}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditIndustryDialogProps {
  industry: Industry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditIndustryDialog({ industry, open, onOpenChange }: EditIndustryDialogProps) {
  const updateIndustry = useIndustryStore((state) => state.updateIndustry);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    industryName: industry.industryName || "",
    location: industry.industryLocation || "",
    industryType: industry.industryType || "",
    industryEmail: industry.industryEmail || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateIndustry(industry.industryId, formData);
      onOpenChange(false);
      toast.success("Industry updated successfully!");
    } catch (error: any) {
      console.error("Failed to update industry:", error);
      toast.error(error.message || "Failed to update industry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Industry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Industry Name
            </label>
            <input
              required
              type="text"
              name="industryName"
              value={formData.industryName}
              onChange={handleChange}
              placeholder="e.g. Systems Ltd"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Karachi"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Industry Type
            </label>
            <input
              required
              type="text"
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              placeholder="e.g. Software House"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              required
              type="email"
              name="industryEmail"
              value={formData.industryEmail}
              onChange={handleChange}
              placeholder="e.g. contact@company.com"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteIndustryDialogProps {
  industry: Industry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteIndustryDialog({ industry, open, onOpenChange }: DeleteIndustryDialogProps) {
  const deleteIndustry = useIndustryStore((state) => state.deleteIndustry);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteIndustry(industry.industryId);
      onOpenChange(false);
      toast.success(`${industry.industryName} has been deleted.`);
    } catch (error: any) {
      console.error("Failed to delete industry:", error);
      toast.error(error.message || "Failed to delete industry.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {industry.industryName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete <strong>{industry.industryName}</strong>?
            This action cannot be undone and will fail if this industry is currently tied to active projects.
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
