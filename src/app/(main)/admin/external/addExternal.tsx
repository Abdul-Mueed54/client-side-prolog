import React, { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useExternalStore, NewExternalPayload } from "@/store/useExternalStore";
import { useIndustryStore } from "@/store/useIndustryStore"; // Brings in your industries
import IndustryDropdown from "@/components/dropDown/industryDropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddExternalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addExternal = useExternalStore((state) => state.addExternal);
  const { industries, fetchIndustries } = useIndustryStore();

  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewExternalPayload>({
    extName: "",
    extEmail: "",
    extDesignation: "",
    industryName: "",
  });

  useEffect(() => {
    if (industries.length === 0) {
      fetchIndustries();
    }
  }, [industries.length, fetchIndustries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIndustryChange = (newIndustryName: string) => {
    setFormData({ ...formData, industryName: newIndustryName });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      await addExternal(formData);
      setFormData({
        extName: "",
        extEmail: "",
        extDesignation: "",
        industryName: "",
      });
      setApiError(null);
      setIsOpen(false);
    } catch (error: any) {
      setApiError(
        error.message || "Failed to add external supervisor. Please try again.",
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
          <Button className="bg-brand text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add External
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add External Supervisor</DialogTitle>
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
              Full Name
            </label>
            <input
              required
              type="text"
              name="extName"
              value={formData.extName}
              onChange={handleChange}
              placeholder="e.g. Sarah Connor"
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
              name="extEmail"
              value={formData.extEmail}
              onChange={handleChange}
              placeholder="e.g. sarah.connor@company.com"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Designation
            </label>
            <input
              required
              type="text"
              name="extDesignation"
              value={formData.extDesignation}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Industry
            </label>
            <IndustryDropdown
              options={industries}
              value={formData.industryName}
              onChange={handleIndustryChange}
              placeholder="Select Industry..."
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
              Save External
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
