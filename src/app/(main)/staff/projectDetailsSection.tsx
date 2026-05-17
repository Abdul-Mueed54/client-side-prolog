import React from "react";
import { FileText } from "lucide-react";
import DomainDropdown from "@/components/dropDown/domainsDropdown";
import YearDropdown from "@/components/dropDown/batchDropdown";
import { useDomainsStore } from "@/store/useDomainStore";
import { generateAcademicYears } from "@/components/generateAcademicYears";

export default function ProjectDetailsSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: any;
}) {
  const { domains } = useDomainsStore();

  const academicYears = generateAcademicYears();

  return (
    <section>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
        <FileText className="w-5 h-5 text-slate-400" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
          Project Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Project Title *
          </label>
          <input
            required
            type="text"
            value={formData.projectTitle}
            onChange={(e) => updateForm("projectTitle", e.target.value)}
            placeholder="e.g. ProLog - Project Cataloging System"
            className="w-full p-3 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Abstract *
          </label>
          <textarea
            required
            value={formData.abstract}
            onChange={(e) => updateForm("abstract", e.target.value)}
            rows={4}
            placeholder="Enter the complete project abstract..."
            className="w-full p-3 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all resize-y"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Academic Year *
          </label>
          <YearDropdown
            options={academicYears}
            value={formData.academicYear}
            onChange={(val) => updateForm("academicYear", val)}
            placeholder="Select Year"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Domains *
          </label>
          <DomainDropdown
            options={domains}
            value={formData.domainIds} // Expects string[]
            onChange={(val) => updateForm("domainIds", val)}
            placeholder="Select Domains..."
          />
        </div>
      </div>
    </section>
  );
}
