"use client";

import { useEffect, useState } from "react";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
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
  DialogDescription,
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

import { Faculty } from "@/types";
import DepartmentDropdown from "@/components/dropDown/departmentsDropdown";
import { useDepartmentStore } from "@/store/useDeptStore";
import { useFacultyStore } from "@/store/useFacultyStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface FacultyActionsProps {
  faculty: Faculty;
}

export function FacultyActions({ faculty }: FacultyActionsProps) {
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
            onClick={() => navigator.clipboard.writeText(faculty.facultyId)}
          >
            Copy Faculty ID
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

      <EditFacultyDialog
        faculty={faculty}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteFacultyDialog
        faculty={faculty}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditFacultyDialogProps {
  faculty: Faculty;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditFacultyDialog({ faculty, open, onOpenChange }: EditFacultyDialogProps) {
  const { departments, fetchDepartments } = useDepartmentStore();
  const updateFaculty = useFacultyStore((state) => state.updateFaculty);
  const token = useAuthStore((state) => state.token);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userName: faculty.facultyName || "",
    userEmail: faculty.facultyEmail || "",
    userContactNo: "",
    deptAbbreviation: faculty.deptAbbreviation || "",
    designation: "",
    areaOfResearch: "",
  });

  // Fetch departments if they aren't loaded yet
  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments]);

  // Fetch full user details when dialog opens
  useEffect(() => {
    if (open) {
      const fetchFullDetails = async () => {
        setIsLoadingData(true);
        try {
          const headers: any = { "Content-Type": "application/json" };
          if (token) headers["Authorization"] = `Bearer ${token}`;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${faculty.facultyId}`, {
            headers
          });

          const json = await res.json();

          if (res.ok && json.data) {
            const fullData = json.data;
            setFormData({
              userName: fullData.userName || faculty.facultyName,
              userEmail: fullData.userEmail || faculty.facultyEmail,
              userContactNo: fullData.userContactNo || "",
              deptAbbreviation: fullData.deptAbbreviation || faculty.deptAbbreviation,
              designation: fullData.designation || "",
              areaOfResearch: fullData.areaOfResearch || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch full faculty details:", error);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchFullDetails();
    }
  }, [open, faculty.facultyId, faculty.facultyName, faculty.facultyEmail, faculty.deptAbbreviation, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeptChange = (newDept: string) => {
    setFormData({ ...formData, deptAbbreviation: newDept });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateFaculty(faculty.facultyId, formData);
      onOpenChange(false);
      toast.success("Faculty profile updated successfully!");
    } catch (error) {
      console.error("Failed to update faculty:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update faculty profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Faculty Member</DialogTitle>
          <DialogDescription>
            Make changes to {faculty.facultyName} &apos; s profile below.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <p className="text-sm text-slate-500 mt-2">Loading full profile...</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <input
                  required
                  type="text"
                  name="userContactNo"
                  value={formData.userContactNo}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Department
                </label>
                <DepartmentDropdown
                  options={departments}
                  value={formData.deptAbbreviation}
                  onChange={handleDeptChange}
                  placeholder="Select Department..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Designation
                </label>
                <input
                  required
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Area of Research
                </label>
                <input
                  required
                  type="text"
                  name="areaOfResearch"
                  value={formData.areaOfResearch}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>
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
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DeleteFacultyDialogProps {
  faculty: Faculty;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteFacultyDialog({ faculty, open, onOpenChange }: DeleteFacultyDialogProps) {
  const deleteFaculty = useFacultyStore((state) => state.deleteFaculty);
  const handleDelete = async () => {
    try {
      await deleteFaculty(faculty.facultyId);
      onOpenChange(false);
      toast.success(`${faculty.facultyName} has been removed.`);
    } catch (error) {
      console.error("Failed to delete faculty:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete faculty profile.");
    }
    console.log("Deleting faculty:", faculty.facultyId);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the faculty record for <strong>{faculty.facultyName}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
