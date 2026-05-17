import React from "react";
import { Building2 } from "lucide-react";
import IndustryDropdown from "@/components/dropDown/industryDropdown";
import ExternalSupervisorDropdown from "@/components/dropDown/externalSupervisorDropdown";
import AssociationTypeDropdown from "@/components/dropDown/stringDropDown";

import { useIndustryStore } from "@/store/useIndustryStore";
import { useExternalStore } from "@/store/useExternalStore";

export default function IndustryInfoSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: any;
}) {
  const { industries } = useIndustryStore();
  const { externals } = useExternalStore();

  const associationTypes = [
    "Sponsored",
    "Data Provider",
    "Mentorship",
    "Hardware Support",
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Industry Info (Optional)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Industry Name *
          </label>
          <IndustryDropdown
            options={industries}
            value={formData.industryName}
            onChange={(val) => updateForm("industryName", val)}
            placeholder="Select Industry..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Association Type *
          </label>
          <AssociationTypeDropdown
            options={associationTypes}
            value={formData.associationType}
            onChange={(val) => updateForm("associationType", val)}
            placeholder="Select Type..."
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            External Supervisor Email *
          </label>
          <ExternalSupervisorDropdown
            options={externals}
            value={formData.extEmail}
            onChange={(val) => updateForm("extEmail", val)}
            placeholder="Select External Supervisor..."
          />
        </div>
      </div>
    </section>
  );
}
