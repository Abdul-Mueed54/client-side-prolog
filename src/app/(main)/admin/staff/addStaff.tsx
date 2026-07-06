import React, { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useStaffStore, NewStaffPayload } from "@/store/useStaffStore";
import { useDepartmentStore } from "@/store/useDeptStore";
import DepartmentDropdown from "@/components/dropDown/departmentsDropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddStaffButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addStaff = useStaffStore((state) => state.addStaff);
  const { departments, fetchDepartments } = useDepartmentStore();

  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewStaffPayload>({
    userName: "",
    userEmail: "",
    userContactNo: "",
    password: "",
    deptAbbreviation: "",
    jobTitle: "",
  });

  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeptChange = (newDept: string) => {
    setFormData({ ...formData, deptAbbreviation: newDept });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      await addStaff(formData);
      setFormData({
        userName: "",
        userEmail: "",
        userContactNo: "",
        password: "",
        deptAbbreviation: "",
        jobTitle: "",
      });
      setApiError(null);
      setIsOpen(false);
    } catch (error: any) {
      setApiError(
        error.message || "Failed to add staff member. Please try again.",
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setApiError(null);
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-brand hover:bg-brand/90 text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

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
                placeholder="e.g. Abdul Mueed"
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
                placeholder="e.g. staff@neduet.edu.pk"
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
                placeholder="e.g. 03152379455"
                className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <input
                required
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Lab Attendant"
                className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl"
            >
              Save Staff
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
