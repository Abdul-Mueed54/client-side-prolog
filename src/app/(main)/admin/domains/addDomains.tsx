import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useDomainsStore, NewDomainPayload } from "@/store/useDomainStore";
import { useFilterStore } from "@/store/useFilterStore"; // Import to get Departments!
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DepartmentDropdown from "@/components/dropDown/departmentsDropdown";

export default function AddDomainButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addDomain = useDomainsStore((state) => state.addDomain);
  const { departments, fetchFilters } = useFilterStore();
  const [apiError, setApiError] =useState<string | null>(null);
  const [formData, setFormData] = useState<NewDomainPayload>({
    domainName: "",
    domainDescription: "",
    deptAbbreviation: "",
  });

  useEffect(() => {
    if (departments.length === 0) {
      fetchFilters();
    }
  }, [departments.length, fetchFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDomain(formData);
      setFormData({
        domainName: "",
        domainDescription: "",
        deptAbbreviation: "",
      });
      setIsOpen(false);
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message || "failed to add domain");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand hover:bg-brand/90 text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add Domain
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Domain</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Domain Name
            </label>
            <input
              required
              type="text"
              name="domainName"
              value={formData.domainName}
              onChange={handleChange}
              placeholder="e.g. AI/ML or Cloud Computing"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              name="domainDescription"
              value={formData.domainDescription}
              onChange={handleChange}
              placeholder="e.g. Artificial Intelligence & Deep Learning"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="max-w-97">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <DepartmentDropdown
              options={departments}
              value={formData.deptAbbreviation}
              onChange={(val) =>
                setFormData({ ...formData, deptAbbreviation: val })
              }
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

              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl"
            >
              Save Domain
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
