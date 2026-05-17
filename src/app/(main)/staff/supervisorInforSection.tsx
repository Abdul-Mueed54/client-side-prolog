import React from "react";
import { UserCheck, Plus, Trash2 } from "lucide-react";
import FacultyDropdown from "@/components/dropDown/facultyDropdown";
import RoleDropdown from "@/components/dropDown/stringDropDown";
import { useFacultyStore } from "@/store/useFacultyStore";

export default function SupervisorInfoSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: any;
}) {
  const { faculty } = useFacultyStore();
  const supervisors = formData.facultySupervisors;

  // Static options for Roles
  const facultyRoles = ["Primary Supervisor", "Co-supervisor"];

  const handleAddSupervisor = () => {
    updateForm("facultySupervisors", [
      ...supervisors,
      { userId: "", role: "" },
    ]);
  };

  const handleRemoveSupervisor = (indexToRemove: number) => {
    updateForm(
      "facultySupervisors",
      supervisors.filter((_: any, index: number) => index !== indexToRemove),
    );
  };

  const handleUpdateSupervisor = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...supervisors];
    updated[index] = { ...updated[index], [field]: value };
    updateForm("facultySupervisors", updated);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Faculty Supervisors
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAddSupervisor}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> Add Supervisor
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {supervisors.map((supervisor: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end relative"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Supervisor *
              </label>
              <FacultyDropdown
                options={faculty}
                value={supervisor.userId}
                onChange={(val) => handleUpdateSupervisor(index, "userId", val)}
                placeholder="Select Faculty..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Role *
              </label>
              <RoleDropdown
                options={facultyRoles}
                value={supervisor.role}
                onChange={(val) => handleUpdateSupervisor(index, "role", val)}
                placeholder="Select Role..."
              />
            </div>

            {supervisors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveSupervisor(index)}
                className="mb-1 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-200"
                title="Remove Supervisor"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
