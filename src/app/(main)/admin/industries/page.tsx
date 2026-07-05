"use client";

import { useIndustryStore } from "@/store/useIndustryStore";
import { columns } from "./columns";
import { DataTable } from "./industryDataTable";
import { useEffect } from "react";
import AddIndustryButton from "./addIndustry";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function IndustryTable() {
  const { industries, fetchIndustries } = useIndustryStore();

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-5 item-center">
          <AddIndustryButton />
        </div>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={industries} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
