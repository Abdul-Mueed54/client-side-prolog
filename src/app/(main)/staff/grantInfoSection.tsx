import React from "react";
import IndustryDropdown from "@/components/dropDown/industryDropdown";
import { useIndustryStore } from "@/store/useIndustryStore";

export default function GrantInfoSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: (field: string, value: any) => void;
}) {
  const { industries } = useIndustryStore();

  return (
    <section>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
        <div className="w-5 h-5 text-emerald-500 flex items-center justify-center font-bold text-lg">
          $
        </div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
          Grant Info (Optional)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">

        {/* New Field: Industry Provider */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sponsoring Industry
          </label>
          <IndustryDropdown
            options={industries}
            value={formData.grantIndustryName}
            onChange={(val) => updateForm("grantIndustryName", val)}
            placeholder="Select Sponsor..."
          />
        </div>

        {/* New Field: Hardcoded Association Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Association Type
          </label>
          <input
            type="text"
            value="Sponsored"
            disabled
            className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 cursor-not-allowed font-medium"
          />
        </div>

        {/* Existing Grant Fields */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Grant Name
          </label>
          <input
            type="text"
            value={formData.grantName}
            onChange={(e) => updateForm("grantName", e.target.value)}
            placeholder="e.g. HealthTech Innovation"
            className="w-full p-2.5 bg-white border border-emerald-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Grant Amount (PKR)
          </label>
          <input
            type="number"
            value={formData.grantAmount}
            onChange={(e) => updateForm("grantAmount", e.target.value)}
            placeholder="e.g. 150000"
            className="w-full p-2.5 bg-white border border-emerald-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Received Date
          </label>
          <input
            type="date"
            value={formData.recievedDate}
            onChange={(e) => updateForm("recievedDate", e.target.value)}
            className="w-full p-2.5 bg-white border border-emerald-200 rounded-md text-sm outline-none text-slate-600 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </section>
  );
}