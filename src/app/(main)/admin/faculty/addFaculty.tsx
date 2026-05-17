import React, { useState, useEffect } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { useFacultyStore, NewFacultyPayload } from "@/store/useFacultyStore";
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

export default function AddFacultyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const error = useFacultyStore();
  // console.log(error)
  const addFaculty = useFacultyStore((state) => state.addFaculty);
  const { departments, fetchDepartments } = useDepartmentStore();

  const [formData, setFormData] = useState<NewFacultyPayload>({
    userName: "",
    userEmail: "",
    userContactNo: "",
    password: "",
    deptAbbreviation: "",
    designation: "",
    areaOfResearch: "",
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
    try {
      await addFaculty(formData);
      setFormData({
        userName: "",
        userEmail: "",
        userContactNo: "",
        password: "",
        deptAbbreviation: "",
        designation: "",
        areaOfResearch: "",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Submission failed");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button className="bg-brand text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
              <Plus className="w-4 h-4" />
              Add Faculty
            </Button>
          }
        ></DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Supervising Faculty</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
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
                  placeholder="e.g. Dr. Jane Doe"
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
                  placeholder="e.g. faculty@neduet.edu.pk"
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
                  placeholder="e.g. 03001234567"
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
                {/* Using your custom minimalist dropdown! */}
                <DepartmentDropdown
                  options={departments}
                  value={formData.deptAbbreviation}
                  onChange={handleDeptChange}
                  placeholder="Select Department..."
                />
              </div>

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
                  placeholder="e.g. Assistant Professor"
                  className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
                />
              </div>
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
                placeholder="e.g. Artificial Intelligence, Cloud Computing"
                className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
              />
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
                Save Faculty
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
