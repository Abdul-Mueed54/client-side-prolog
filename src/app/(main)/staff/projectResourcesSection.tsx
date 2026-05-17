import React from "react";
import { Paperclip, UploadCloud, FileCheck2 } from "lucide-react";

export default function ProjectResourcesSection({
  formData,
  updateForm,
}: {
  formData: any;
  updateForm: any;
}) {
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "reportFile" | "resourceFile",
  ) => {
    const file = e.target.files?.[0] || null;
    updateForm(fieldName, file);
  };

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
        <Paperclip className="w-5 h-5 text-slate-400" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
          Project Resources
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Upload Box */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Project Report (.pdf) *
          </label>
          <div
            className={`relative flex flex-col items-center justify-center w-full h-32 px-4 transition-all bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer focus:outline-none ${
              formData.reportFile
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-2 text-center pointer-events-none">
              {formData.reportFile ? (
                <>
                  <FileCheck2
                    className="w-8 h-8 text-emerald-500"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-emerald-700 text-sm truncate max-w-[200px]">
                    {formData.reportFile.name}
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud
                    className="w-8 h-8 text-slate-400"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-slate-600 text-sm">
                    Click to browse PDF
                  </span>
                </>
              )}
            </div>
            {/* The actual hidden file input covering the whole box */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleInput(e, "reportFile")}
              className="absolute block w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* ZIP Upload Box */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Other Resources (.zip)
          </label>
          <div
            className={`relative flex flex-col items-center justify-center w-full h-32 px-4 transition-all bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer focus:outline-none ${
              formData.resourceFile
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-2 text-center pointer-events-none">
              {formData.resourceFile ? (
                <>
                  <FileCheck2
                    className="w-8 h-8 text-emerald-500"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-emerald-700 text-sm truncate max-w-[200px]">
                    {formData.resourceFile.name}
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud
                    className="w-8 h-8 text-slate-400"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-slate-600 text-sm">
                    Click to browse ZIP
                  </span>
                </>
              )}
            </div>
            {/* The actual hidden file input covering the whole box */}
            <input
              type="file"
              accept=".zip,.rar"
              onChange={(e) => handleInput(e, "resourceFile")}
              className="absolute block w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
