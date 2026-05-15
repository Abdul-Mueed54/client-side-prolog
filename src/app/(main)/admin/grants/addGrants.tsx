import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useGrantStore, NewGrantPayload } from "@/store/useGrantsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddGrantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addGrant = useGrantStore((state) => state.addGrant);

  const [formData, setFormData] = useState<NewGrantPayload>({
    name: "",
    amount: "",
    industryName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGrant(formData);
      // Reset form and close the shadcn dialog on success
      setFormData({ name: "", amount: "", industryName: "" });
      setIsOpen(false);
    } catch (error) {
      // If the backend rejects it, the modal stays open so the user can fix the error!
      console.error("Submission failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand text-black rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition">
            <Plus className="w-4 h-4" />
            Add Grant
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Grant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Grant Name
            </label>
            <input
              required
              type="text"
              name="grantName"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ignite FYP Fund"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Grant Amount (PKR)
            </label>
            <input
              required
              type="number"
              name="grantAmount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 100000"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Industry ID
            </label>
            <input
              required
              type="text"
              name="industryId"
              value={formData.industryName}
              onChange={handleChange}
              placeholder="IND-GLB-002"
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
              Save Grant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
