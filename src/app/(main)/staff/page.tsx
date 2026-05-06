"use client";

import React, { useState } from "react";
import {
  FileText,
  Users,
  Building2,
  UserCheck,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
// Assuming you have these paths correct in your project
import { generateAcademicYears } from "@/components/generateAcademicYears";
import { UniversalDropdown } from "@/components/dropDown/universalDropDown";

export default function StaffUploadForm() {
  const academicYears = generateAcademicYears(5);

  // --- DYNAMIC DATA STATES ---
  const [industryOptions, setIndustryOptions] = useState([
    "Straviam PVT. LTD.",
    "Bank Al Habib Limited",
    "Tech Corp Solutions",
  ]);

  const [supervisorOptions, setSupervisorOptions] = useState([
    "nauman12@cloud.neduet.edu.pk",
    "aisha@cloud.neduet.edu.pk",
  ]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    academicYear: "",
    domain: [] as string[], // Explicitly an array for Multi-select
    teamMember: "",
    projectReport: "",
    otherResources: "",
    industries: [
      { name: "", associationType: "", grantName: "", supervisor: "" },
    ],
    supervisors: [{ email: "", role: "" }],
  });

  // Handler for standard Text Inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dedicated Handler for UniversalDropdowns
  const handleDropdownChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- DYNAMIC BLOCK HANDLERS ---

  // Add a new empty industry block
  const handleAddIndustryBlock = () => {
    setFormData((prev) => ({
      ...prev,
      industries: [
        ...prev.industries,
        { name: "", associationType: "", grantName: "", supervisor: "" },
      ],
    }));
  };

  // Update a specific field inside a specific industry block
  const handleIndustryChange = (index: number, field: string, value: any) => {
    const updatedIndustries = [...formData.industries];
    updatedIndustries[index] = { ...updatedIndustries[index], [field]: value };
    setFormData((prev) => ({ ...prev, industries: updatedIndustries }));
  };
  // Remove a specific industry block
  const handleRemoveIndustryBlock = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Add a new empty supervisor block
  const handleAddSupervisorBlock = () => {
    setFormData((prev) => ({
      ...prev,
      supervisors: [...prev.supervisors, { email: "", role: "" }],
    }));
  };

  // Update a specific field inside a specific supervisor block
  const handleSupervisorChange = (index: number, field: string, value: any) => {
    const updatedSupervisors = [...formData.supervisors];
    updatedSupervisors[index] = {
      ...updatedSupervisors[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, supervisors: updatedSupervisors }));
  };

  // Remove a specific supervisor block
  const handleRemoveSupervisorBlock = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      supervisors: prev.supervisors.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };
  // --- SUBMIT & CLEAR ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted by Staff:", formData);
    alert("Project Added To The Repository Successfully");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the entire form?")) {
      setFormData({
        title: "",
        abstract: "",
        academicYear: "",
        domain: [],
        teamMember: "",
        projectReport: "",
        otherResources: "",
        industries: [],
        supervisors: [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans text-slate-700 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-8 md:p-12">
        <div className="mb-10 border-b border-slate-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Upload New Project
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Staff Data Entry Portal. All dropdown menus are strictly locked to
            admin-approved values.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          {/* ==================== SECTION 1: PROJECT DETAILS ==================== */}
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. ProLog - Project Cataloging System"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#EF9F27] focus:outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Abstract *
                </label>
                <textarea
                  required
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter the complete project abstract..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#EF9F27] focus:outline-none transition-all resize-y"
                />
              </div>

              <UniversalDropdown
                label="Academic Year *"
                placeholder="Select Year"
                options={academicYears}
                value={parseInt(formData.academicYear)}
                onChange={(val) => handleDropdownChange("academicYear", val)}
              />

              <UniversalDropdown
                label="Domain Name *"
                placeholder="Select Domains..."
                options={["AI/ML", "Web Dev", "Cyber Security", "Data Science"]}
                multiple={true} // Multi-Select!
                searchable={true} // Enable Search!
                value={formData.domain}
                onChange={(val) => handleDropdownChange("domain", val)}
              />
            </div>
          </section>

          {/* ==================== SECTION 2: STUDENTS INFO ==================== */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <Users className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Students Info
              </h2>
            </div>

            <UniversalDropdown
              label="Team Leader / Member *"
              placeholder="Select Registered Student"
              options={[
                "CS-24115 - MUBASHIR UDDIN",
                "CS-24132 - IRFAN RAZA",
                "CS-24138 - USAMA HASAN",
              ]}
              searchable={true}
              value={formData.teamMember}
              onChange={(val) => handleDropdownChange("teamMember", val)}
            />
          </section>

          {/* ==================== SECTION 3: INDUSTRY INFO ==================== */}

          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Industry Info (Optional)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddIndustryBlock}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add Industry
            </button>
          </div>

          {/* Map over the industries array to create dynamic blocks */}
          <div className="flex flex-col gap-8">
            {formData.industries.map((industry, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 relative bg-slate-50/50 p-4 rounded-xl border border-slate-100"
              >
                {/* --- NEW: Block Header & Remove Button --- */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Industry #{index + 1}
                  </span>

                  {/* Only show Remove button if there's more than 1 block, OR if you want them to be able to delete all of them, remove the length check */}
                  {formData.industries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustryBlock(index)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>

                {/* Your Existing Dropdowns */}
                <UniversalDropdown
                  label="Industry Name"
                  placeholder="Select Industry..."
                  options={[
                    "Straviam PVT. LTD.",
                    "Bank Al Habib Limited",
                    "Tech Corp Solutions",
                  ]}
                  searchable={true}
                  value={industry.name}
                  onChange={(val) => handleIndustryChange(index, "name", val)}
                />

                <UniversalDropdown
                  label="Association Type"
                  placeholder="Select Type..."
                  options={["Sponsored", "Partner", "Data Provider"]}
                  value={industry.associationType}
                  onChange={(val) =>
                    handleIndustryChange(index, "associationType", val)
                  }
                />

                <UniversalDropdown
                  label="Grant Name"
                  placeholder="Select Grant..."
                  options={["FYDP Support Fund", "HEC Innovation Grant"]}
                  value={industry.grantName}
                  onChange={(val) =>
                    handleIndustryChange(index, "grantName", val)
                  }
                />

                <UniversalDropdown
                  label="Industry Supervisor"
                  placeholder="Select Supervisor..."
                  options={["ahmed34@straviam.com", "sarah@techcorp.com"]}
                  searchable={true}
                  value={industry.supervisor}
                  onChange={(val) =>
                    handleIndustryChange(index, "supervisor", val)
                  }
                />
              </div>
            ))}
          </div>

          {/* ==================== SECTION 4: SUPERVISOR INFO ==================== */}
          <section>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Supervisor Info
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddSupervisorBlock}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add Supervisor
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {/* Map over the supervisors array */}
              {formData.supervisors.map((supervisor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
                >
                  {formData.supervisors.length > 1 && (
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-100 rounded-full" />
                  )}

                  <UniversalDropdown
                    label="Supervisor's Email *"
                    placeholder="Select Email..."
                    options={[
                      "nauman12@cloud.neduet.edu.pk",
                      "aisha@cloud.neduet.edu.pk",
                    ]}
                    searchable={true}
                    value={supervisor.email}
                    onChange={(val) =>
                      handleSupervisorChange(index, "email", val)
                    }
                  />

                  <UniversalDropdown
                    label="Supervisory Role *"
                    placeholder="Select Role..."
                    options={["Primary Supervisor", "Co-supervisor", "Advisor"]}
                    value={supervisor.role}
                    onChange={(val) =>
                      handleSupervisorChange(index, "role", val)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ==================== SECTION 5: PROJECT RESOURCES ==================== */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              <Paperclip className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Project Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Project Report Path
                </label>
                <input
                  type="text"
                  name="projectReport"
                  value={formData.projectReport}
                  onChange={handleChange}
                  placeholder="e.g. /home/user/FYPs/ProLog.pdf"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#EF9F27] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Other Resources Path
                </label>
                <input
                  type="text"
                  name="otherResources"
                  value={formData.otherResources}
                  onChange={handleChange}
                  placeholder="e.g. /home/user/FYPs/ProLog.zip"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#EF9F27] focus:outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* ==================== ACTIONS ==================== */}
          <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm tracking-widest uppercase rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#EF9F27] hover:bg-[#d88c20] text-white font-bold text-sm tracking-widest uppercase rounded-md transition-colors shadow-sm"
            >
              Review & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// TODO: the form has became massively large will break it in components 