"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

// Zustand Stores
import { useDomainsStore } from "@/store/useDomainStore";
import { useGroupStore } from "@/store/useGroupStore";
import { useIndustryStore } from "@/store/useIndustryStore";
import { useFacultyStore } from "@/store/useFacultyStore";
import { useExternalStore } from "@/store/useExternalStore";

// Form Sections
import ProjectDetailsSection from "./projectDetailsSection";
import StudentsInfoSection from "./studentsInfoSection";
import SupervisorInfoSection from "./supervisorInforSection";
import IndustryInfoSection from "./industryInfoSection";
import ProjectResourcesSection from "./projectResourcesSection";
import { Loader2 } from "lucide-react";
import GrantInfoSection from "./grantInfoSection";

export interface IndustryPayload {
  industryName: string;
  associationType: string;
  extEmail: string;
  grantName: string;
  grantAmount: string;
  recievedDate: string;
}

export default function StaffUploadForm() {
  const { fetchDomains } = useDomainsStore();
  const { fetchGroups } = useGroupStore();
  const { fetchIndustries } = useIndustryStore();
  const { fetchFaculty } = useFacultyStore();
  const { fetchExternals } = useExternalStore();

  useEffect(() => {
    fetchDomains();
    fetchGroups();
    fetchIndustries();
    fetchFaculty({});
    fetchExternals();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectTitle: "",
    abstract: "",
    academicYear: "",
    groupId: "",
    domainIds: [] as string[],
    facultySupervisors: [{ userId: "", role: "", remark: "" }],
    industries: [] as {
      industryName: string;
      associationType: string;
      extEmail: string;
    }[],

    // Grant specific states
    grantIndustryName: "",
    grantName: "",
    grantAmount: "",
    recievedDate: "", // Replaced flat strings with an array of objects
    reportFile: null as File | null,
    resourceFile: null as File | null,
  });

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Uploading project and resources...");

    const targetForm = e.currentTarget;
    const payload = new FormData();

    payload.append("projectTitle", formData.projectTitle);
    payload.append("abstract", formData.abstract);
    payload.append("academicYear", formData.academicYear);
    payload.append("groupId", formData.groupId);
    payload.append("domainIds", JSON.stringify(formData.domainIds));
    payload.append(
      "facultySupervisors",
      JSON.stringify(formData.facultySupervisors),
    );

    // Append the entire industries array as a JSON string
    if (formData.industries && formData.industries.length > 0) {
      payload.append("industries", JSON.stringify(formData.industries));
    }
    if (formData.grantIndustryName) payload.append("grantIndustryName", formData.grantIndustryName);
    if (formData.grantName) payload.append("grantName", formData.grantName);
    if (formData.grantAmount) payload.append("grantAmount", formData.grantAmount);
    if (formData.recievedDate) payload.append("recievedDate", formData.recievedDate);

    if (formData.reportFile) payload.append("reportFile", formData.reportFile);
    if (formData.resourceFile)
      payload.append("resourceFile", formData.resourceFile);

    try {
      const token = useAuthStore.getState().token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/create`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        },
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const newProjectId = result.data?.projectId;

      toast.success(
        `Success! Project ${newProjectId || "Created"} registered.`,
        {
          id: toastId,
          description:
            "The project, resources, and grants have been successfully saved.",
        },
      );

      // Clear the form
      setFormData({
        projectTitle: "",
        abstract: "",
        academicYear: "",
        groupId: "",
        domainIds: [],
        facultySupervisors: [{ userId: "", role: "", remark: "" }],
        industries: [],
        grantName: "",
        grantIndustryName: "",
        grantAmount: "",
        recievedDate: "",
        reportFile: null,
        resourceFile: null,
      });

      targetForm.reset();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload project.", {
        id: toastId,
        description:
          "Please check your network connection or form data and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["staff", "admin"]}>
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
            <ProjectDetailsSection
              formData={formData}
              updateForm={updateForm}
            />
            <StudentsInfoSection formData={formData} updateForm={updateForm} />
            <SupervisorInfoSection
              formData={formData}
              updateForm={updateForm}
            />

            {/* Unified Industry & Grant Section */}
            <IndustryInfoSection formData={formData} updateForm={updateForm} />
            <GrantInfoSection formData={formData} updateForm={updateForm}/>

            <ProjectResourcesSection
              formData={formData}
              updateForm={updateForm}
            />

            <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-brand hover:bg-[#d88c20] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase rounded-md transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-brand" />
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  "Upload to Repository"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
