import React from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import IndustryDropdown from "@/components/dropDown/industryDropdown";
import ExternalSupervisorDropdown from "@/components/dropDown/externalSupervisorDropdown";
import AssociationTypeDropdown from "@/components/dropDown/stringDropDown";
import { useExternalStore } from "@/store/useExternalStore";
import { useIndustryStore } from "@/store/useIndustryStore";

export default function IndustryInfoSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: (field: string, value: any) => void;
}) {
  const { externals } = useExternalStore();
  const { industries: availableIndustries } = useIndustryStore();

  const currentIndustries = formData.industries || [];

  const handleAddIndustry = () => {
    updateForm("industries", [
      ...currentIndustries,
      { industryName: "", associationType: "", extEmail: "" },
    ]);
  };

  const handleRemoveIndustry = (indexToRemove: number) => {
    updateForm(
      "industries",
      currentIndustries.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  const handleIndustryChange = (index: number, field: string, value: string) => {
    const updatedIndustries = [...currentIndustries];
    updatedIndustries[index][field] = value;

    // Auto-clear supervisor if industry changes to avoid mismatches
    if (field === "industryName") {
      updatedIndustries[index].extEmail = "";
    }

    updateForm("industries", updatedIndustries);
  };

  const associationTypes = ["Data Provider", "Mentorship", "Hardware Support"];

  return (
    <section>
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Industry Info (Optional)
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAddIndustry}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> Add Industry
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {currentIndustries.map((ind: any, index: number) => {
          // Dynamically filter supervisors based on the selected industry name
          const filteredExternals = externals.filter(
            (ext: any) => ext.industryName === ind.industryName
          );

          return (
            <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => handleRemoveIndustry(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Industry Name *
                </label>
                <IndustryDropdown
                  options={availableIndustries}
                  value={ind.industryName}
                  onChange={(val) => handleIndustryChange(index, "industryName", val)}
                  placeholder="Select Industry..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Association Type *
                </label>
                <AssociationTypeDropdown
                  options={associationTypes}
                  value={ind.associationType}
                  onChange={(val) => handleIndustryChange(index, "associationType", val)}
                  placeholder="Select Type..."
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  External Supervisor Email
                </label>
                <ExternalSupervisorDropdown
                  options={filteredExternals}
                  value={ind.extEmail}
                  onChange={(val) => handleIndustryChange(index, "extEmail", val)}
                  placeholder={ind.industryName ? "Select External Supervisor..." : "Select an industry first"}
                  disabled={!ind.industryName}
                />
              </div>
            </div>
          );
        })}
        {currentIndustries.length === 0 && (
          <p className="text-sm text-slate-400 italic">No additional industries added.</p>
        )}
      </div>
    </section>
  );
}