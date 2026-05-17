import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useGroupStore, NewGroupPayload } from "@/store/useGroupStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddGroupButton() {
  const [isOpen, setIsOpen] = useState(false);
  const addGroup = useGroupStore((state) => state.addGroup);

  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewGroupPayload>({
    groupLeader: "",
    member2: "",
    member3: "",
    member4: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // auto upper case
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      await addGroup(formData);
      setFormData({ groupLeader: "", member2: "", member3: "", member4: "" });
      setApiError(null);
      setIsOpen(false);
    } catch (error: any) {
      setApiError(
        error.message ||
          "Failed to create group. Please check the seat number.",
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
            Create Group
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Global Error Banner */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Group Leader (Seat No)
            </label>
            <input
              required
              type="text"
              name="groupLeader"
              value={formData.groupLeader}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 2 (Seat No)
            </label>
            <input
              required
              type="text"
              name="member2"
              value={formData.member2}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 3 (Seat No)
            </label>
            <input
              required
              type="text"
              name="member3"
              value={formData.member3}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 4 (Seat No)
            </label>
            <input
              required
              type="text"
              name="member4"
              value={formData.member4}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            project ID will be assigned during the creation of Project.
          </p>

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
              Initialize Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
