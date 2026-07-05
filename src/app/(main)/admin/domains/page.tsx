"use client";

import { useDomainsStore } from "@/store/useDomainStore";
import { columns } from "./columns";
import { DataTable } from "./domainsDataTable";
import { useEffect } from "react";
import AddDomainButton from "./addDomains";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DomainsTable() {
  const { domains, fetchDomains, addDomain } = useDomainsStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains, addDomain]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-5 item-center">
          <AddDomainButton />
        </div>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={domains} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
