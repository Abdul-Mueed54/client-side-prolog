import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useIndustryStore } from "@/store/useIndustryStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path based on your shadcn setup
import { Button } from "@/components/ui/button";

export default function AddIndustryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addIndustry = useIndustryStore((state) => state.addIndustry);

  const [formData, setFormData] = useState({
    industryName: "",
    location: "",
    industryType: "",
    industryEmail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addIndustry(formData);
    setFormData({
      industryName: "",
      location: "",
      industryType: "",
      industryEmail: "",
    });
    setIsOpen(false); // Closes the shadcn dialog!
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add Industry
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Industry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl"
            >
              Save Industry
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
