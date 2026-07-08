import React, { useState, useEffect } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { useStudentStore, NewStudentPayload } from "@/store/useStudentsStore";
import { useDepartmentStore } from "@/store/useDeptStore"; // Brings in your departments!
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DepartmentDropdown from "@/components/dropDown/departmentsDropdown";

export default function AddStudentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addStudent = useStudentStore((state: any) => state.addStudent);

  // Bring in the departments and the fetch function
  const { departments, fetchDepartments } = useDepartmentStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewStudentPayload>({
    seatNo: "",
    stdName: "",
    stdEmail: "",
    batch: "",
    deptAbbr: "",
  });

  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value =
      e.target.name === "seatNo"
        ? e.target.value.toUpperCase()
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDeptChange = (newDept: string) => {
    setFormData({ ...formData, deptAbbr: newDept });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStudent(formData);
      setFormData({
        seatNo: "",
        stdName: "",
        stdEmail: "",
        batch: "",
        deptAbbr: "",
      });
      setIsOpen(false);
      setApiError(null)
    }catch (error: any) {
      setApiError(
        error.message ||
          "Failed to create group. Please check the seat number.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand hover:bg-brand/90 text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
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
                Seat Number
              </label>
              <input
                required
                type="text"
                name="seatNo"
                value={formData.seatNo}
                onChange={handleChange}
                placeholder="e.g. CS-24117"
                className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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

          <div className="max-w-97">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Department
                </label>
            <DepartmentDropdown  options={departments} value={formData.deptAbbr} onChange={handleDeptChange}/>
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
              Save Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
