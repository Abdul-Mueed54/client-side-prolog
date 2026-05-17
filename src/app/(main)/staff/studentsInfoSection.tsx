import React from "react";
import { Users } from "lucide-react";
import GroupDropdown from "@/components/dropDown/groupDropdown";
import { useGroupStore } from "@/store/useGroupStore";

export default function StudentsInfoSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: any;
}) {
  const { groups } = useGroupStore();

  return (
    <section>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
        <Users className="w-5 h-5 text-slate-400" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
          Project Group Info
        </h2>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Assigned Group *
        </label>
        <GroupDropdown
          options={groups}
          value={formData.groupId}
          onChange={(val) => updateForm("groupId", val)}
          placeholder="Select Registered Group"
        />
      </div>
    </section>
  );
}
