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
import GrantInfoSection from "./grantInfoSection";
import ProjectResourcesSection from "./projectResourcesSection";

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
    industryName: "",
    associationType: "",
    extEmail: "",
    grantName: "",
    grantAmount: "",
    recievedDate: "",
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
    const HTMLData = new FormData(targetForm);

    const verifiedIndustryName =
      (HTMLData.get("industryName") as string) || formData.industryName;

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

    if (verifiedIndustryName)
      payload.append("industryName", verifiedIndustryName);
    if (formData.associationType)
      payload.append("associationType", formData.associationType);
    if (formData.extEmail) payload.append("extEmail", formData.extEmail);
    if (formData.grantName) payload.append("grantName", formData.grantName);
    if (formData.grantAmount)
      payload.append("grantAmount", formData.grantAmount);
    if (formData.recievedDate)
      payload.append("recievedDate", formData.recievedDate);
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

      console.log(
        "Verified Industry Name being passed to Grant:",
        verifiedIndustryName,
      );

      // CREATE THE GRANT
      if (formData.grantName && formData.grantAmount) {
        toast.loading("Linking grant information...", { id: toastId });
      }

      // SUCCESS & CLEANUP
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
        industryName: "",
        associationType: "",
        extEmail: "",
        grantName: "",
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
      // ALWAYS unlock the form when finished, even if it failed
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
            <IndustryInfoSection formData={formData} updateForm={updateForm} />
            <GrantInfoSection formData={formData} updateForm={updateForm} />
            <ProjectResourcesSection
              formData={formData}
              updateForm={updateForm}
            />

            <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#EF9F27] hover:bg-[#d88c20] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase rounded-md transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    {/* SVG Loading Spinner */}
                    <svg
                      className="w-5 h-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
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
