"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react";
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

import { useStudentStore } from "@/store/useStudentsStore";
import { useDepartmentStore } from "@/store/useDeptStore";
import { Students } from "@/types"; // Adjust path if needed

interface StudentActionsProps {
  student: Students;
}

export function StudentActions({ student }: StudentActionsProps) {
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

      <EditStudentDialog
        student={student}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteStudentDialog
        student={student}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditStudentDialogProps {
  student: Students;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditStudentDialog({ student, open, onOpenChange }: EditStudentDialogProps) {
  const updateStudent = useStudentStore((state) => state.updateStudent);
  const { departments, fetchDepartments } = useDepartmentStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    seatNo: student.seatNo || "",
    stdName: student.stdName || "",
    stdEmail: student.stdEmail || "",
    batch: student.batch || "",
    // Fallbacks depending on what your backend returns
    deptAbbr: (student as any).deptAbbreviation || (student as any).deptAbbr || "",
  });

  useEffect(() => {
    if (departments.length === 0 && open) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      await updateStudent(student.seatNo, formData);
      onOpenChange(false);
      toast.success("Student updated successfully!");
    } catch (error: any) {
      console.error("Failed to update student:", error);
      setApiError(error.message || "Failed to update student profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setApiError(null);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Seat Number
              </label>
              <input
                disabled
                type="text"
                name="seatNo"
                value={formData.seatNo}
                className="w-full p-2 border border-slate-200 rounded-md outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Batch
              </label>
              <input
                required
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g. 2024"
                maxLength={4}
                className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="stdName"
              value={formData.stdName}
              onChange={handleChange}
              placeholder="e.g. Abdul Mueed"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              name="stdEmail"
              value={formData.stdEmail}
              onChange={handleChange}
              placeholder="e.g. student@neduet.edu.pk"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              required
              name="deptAbbr"
              value={formData.deptAbbr}
              onChange={handleChange}
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="" disabled>Select a Department...</option>
              {departments.map((dept) => (
                <option key={dept.deptAbbreviation} value={dept.deptAbbreviation}>
                  {dept.deptAbbreviation} - {dept.deptName}
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

interface DeleteStudentDialogProps {
  student: Students;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteStudentDialog({ student, open, onOpenChange }: DeleteStudentDialogProps) {
  const deleteStudent = useStudentStore((state) => state.deleteStudent);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent(student.seatNo);
      onOpenChange(false);
      toast.success(`${student.seatNo} deleted successfully.`);
    } catch (error: any) {
      console.error("Failed to delete student:", error);
      toast.error(error.message || "Failed to delete student.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {student.seatNo}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete <strong>{student.stdName}</strong>? This action cannot be undone. If they are assigned to a group, deletion will be blocked.
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
