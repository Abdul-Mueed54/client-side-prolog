"use client";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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

import { Departments } from "@/types";
import { useDepartmentStore } from "@/store/useDeptStore";
import { toast } from "sonner";

interface DepartmentActionsProps {
  department: Departments;
}

export function DepartmentActions({ department }: DepartmentActionsProps) {
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

      <EditDepartmentDialog
        department={department}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteDepartmentDialog
        department={department}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditDepartmentDialogProps {
  department: Departments;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
}: EditDepartmentDialogProps) {
  const updateDepartment = useDepartmentStore(
    (state) => state.updateDepartment,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    deptAbbreviation: department.deptAbbreviation,
    deptName: department.deptName || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase the abbreviation just like in your Add form
    const value =
      e.target.name === "deptAbbreviation"
        ? e.target.value.toUpperCase()
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateDepartment(department.deptAbbreviation, formData);
      onOpenChange(false);
      toast.success("Department updated successfully!");
    } catch (error: any) {
      console.error("Failed to update department:", error);
      toast.error(error.message || "Failed to update department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Abbreviation
            </label>
            <input
              required
              type="text"
              name="deptAbbreviation"
              value={formData.deptAbbreviation}
              onChange={handleChange}
              maxLength={10}
              placeholder="e.g. CIS"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-orange-500 mt-1">
              Warning: Changing this will update all related records across the
              system.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department Name
            </label>
            <input
              required
              type="text"
              name="deptName"
              value={formData.deptName}
              onChange={handleChange}
              placeholder="e.g. Computer and Information Systems"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
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

interface DeleteDepartment {
  department: Departments;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartment) {
  const deleteDepartment = useDepartmentStore(
    (state) => state.deleteDepartment,
  );
  const handleDelete = async () => {
    try {
      await deleteDepartment(department.deptAbbreviation);
      onOpenChange(false);
      toast.success(`${department.deptName} has been removed.`);
    } catch (error) {
      console.error("Failed to delete department:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete department profile.",
      );
    }
    console.log("Deleting department:", department.deptName);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the department record for{" "}
            <strong>{department.deptName}</strong>. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
