import { Search } from "lucide-react";
export default function SearchBar() {
  return (
    <>
      <div className="relative w-full mb-6">
        {/* Search Icon Container - positioned absolutely inside the input */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>

        {/* The Actual Input */}
        <input
          type="text"
          placeholder="Search by faculty, domain, batch, supervisor..."
          className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400  shadow-md transition-all"
        />
      </div>
    </>
  );
}
