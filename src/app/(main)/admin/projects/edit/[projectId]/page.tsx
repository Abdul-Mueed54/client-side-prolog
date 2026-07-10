"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

// Zustand Stores
import { useDomainsStore } from "@/store/useDomainStore";
import { useGroupStore } from "@/store/useGroupStore";
import { useIndustryStore } from "@/store/useIndustryStore";
import { useFacultyStore } from "@/store/useFacultyStore";
import { useExternalStore } from "@/store/useExternalStore";

// Form Sections (Reused from Create page)
import ProjectDetailsSection from "@/app/(main)/staff/projectDetailsSection";
import StudentsInfoSection from "@/app/(main)/staff/studentsInfoSection";
import SupervisorInfoSection from "@/app/(main)/staff/supervisorInforSection";
import IndustryInfoSection from "@/app/(main)/staff/industryInfoSection";
import GrantInfoSection from "@/app/(main)/staff/grantInfoSection";
import ProjectResourcesSection from "@/app/(main)/staff/projectResourcesSection";

export interface IndustryPayload {
  industryName: string;
  associationType: string;
  extEmail: string;
}

export default function EditProjectForm() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  // Store actions
  const { fetchDomains } = useDomainsStore();
  const { fetchGroups } = useGroupStore();
  const { fetchIndustries } = useIndustryStore();
  const { fetchFaculty } = useFacultyStore();
  const { fetchExternals } = useExternalStore();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectTitle: "",
    abstract: "",
    academicYear: "",
    groupId: "",
    domainIds: [] as string[],
    facultySupervisors: [{ userId: "", role: "", remark: "" }],
    industries: [] as IndustryPayload[],
    grantIndustryName: "",
    grantName: "",
    grantAmount: "",
    recievedDate: "",
    reportFile: null as File | null,
    resourceFile: null as File | null,
    existingReportUrl: "",
    existingResourceUrl: "",
  });

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 1. Fetch Lookup Data & Existing Project Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoadingData(true);
        const token = useAuthStore.getState().token;

        // Fetch Dropdown Lookup Data
        fetchDomains();
        fetchGroups();
        fetchIndustries();
        fetchFaculty({});
        fetchExternals();

        // Fetch Existing Project Details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` }, }, );
        if (!response.ok) throw new Error("Failed to fetch project details.");
        const result = await response.json();
        const projectData = result.data;
        const existingReport = projectData.resources?.find((r: any) => r.resource_name === "Report")?.resource_path || "";
        const existingResource = projectData.resources?.find((r: any) => r.resource_name === "Source Code / Assets",)?.resource_path || "";
        const existingdomain = projectData.domains?.map((d: any) => d.domain_id) || [];
        const existingFaculty = projectData.faculty?.length > 0 ? projectData.faculty.map((f: any) => ({ userId: f.faculty_id,role: f.supervisory_role,remark: f.remark || "",})) : [{ userId: "", role: "", remark: "" }]
        const existingIndustries = projectData.industries?.map((ind: any) => ({ industryName: ind.industry_name, associationType: ind.association_type, extEmail: ind.ext_email || "", })) || []
        const existingGrantIndustryName = projectData.grant?.industry_name || ""
        const existingGrantName = projectData.grant?.grant_name || ""
        const existingGrantAmount = projectData.grant?.grant_amount || ""
        const existingGrantRecievedDate = projectData.grant?.recieved_date ? new Date(projectData.grant.recieved_date).toISOString().split("T")[0] : ""

        setFormData({
          projectTitle: projectData.project_title || "",
          abstract: projectData.abstract || "",
          academicYear: projectData.academic_year || "",
          groupId: projectData.group_id || "",
          domainIds: existingdomain,
          facultySupervisors: existingFaculty,
          industries: existingIndustries,
          grantIndustryName: existingGrantIndustryName,
          grantName: existingGrantName,
          grantAmount: existingGrantAmount,
          recievedDate: existingGrantRecievedDate,
          reportFile: null, // Keep null for uploads
          resourceFile: null, // Keep null for uploads
          existingReportUrl: existingReport,
          existingResourceUrl: existingResource,
        });
      } catch (error: any) {
        toast.error("Error loading project", { description: error.message });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (projectId) fetchAllData();
  }, [projectId]);

  // 2. Handle Submit (PATCH)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Updating project details...");

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

    if (formData.industries && formData.industries.length > 0) {
      payload.append("industries", JSON.stringify(formData.industries));
    }

    // Grant Details
    if (formData.grantIndustryName)
      payload.append("grantIndustryName", formData.grantIndustryName);
    if (formData.grantName) payload.append("grantName", formData.grantName);
    if (formData.grantAmount)
      payload.append("grantAmount", formData.grantAmount);
    if (formData.recievedDate)
      payload.append("recievedDate", formData.recievedDate);

    // Only append files if the user selected NEW ones to overwrite the old ones
    if (formData.reportFile) payload.append("reportFile", formData.reportFile);
    if (formData.resourceFile)
      payload.append("resourceFile", formData.resourceFile);

    try {
      const token = useAuthStore.getState().token;

      // PATCH Request to Update
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update project.");
      }

      toast.success("Project updated successfully!", { id: toastId });

      // Navigate back to the table after a successful update
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1500);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update project.", {
        id: toastId,
        description:
          "Please check your network connection or form data and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-brand" />
          <p className="text-sm font-semibold tracking-widest uppercase">
            Fetching Project Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans text-slate-700 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-8 md:p-12">
          <div className="mb-10 border-b border-slate-100 pb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Projects
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Project Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Modifying records for Project ID:{" "}
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                {projectId}
              </span>
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

            {/* Note: Ensure ProjectResourcesSection can handle null initial files gracefully and mentions "Upload to Overwrite" */}
            <ProjectResourcesSection
              formData={formData}
              updateForm={updateForm}
            />

            <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-md transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-brand hover:bg-[#d88c20] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase rounded-md transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="text-sm">Saving Changes...</span>
                  </>
                ) : (
                  "Update Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
