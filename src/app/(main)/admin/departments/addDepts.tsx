import React, { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { useDepartmentStore, NewDepartmentPayload } from "@/store/useDeptStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddDepartmentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addDepartment = useDepartmentStore((state) => state.addDepartment);
  const [apiError, setApiError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewDepartmentPayload>({
    deptAbbreviation: "",
    deptName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Optionally auto-uppercase the abbreviation as the user types
    const value =
      e.target.name === "deptAbbreviation"
        ? e.target.value.toUpperCase()
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDepartment(formData);
      setFormData({ deptAbbreviation: "", deptName: "" });
      setIsOpen(false);
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
            Add Department
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}
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
              placeholder="e.g. CIS or MY"
              maxLength={2}
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
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
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
              Save Department
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
