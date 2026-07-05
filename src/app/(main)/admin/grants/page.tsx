"use client";

import { useGrantStore } from "@/store/useGrantsStore";
import { columns } from "./columns";
import { DataTable } from "./grantsDataTable";
import { Project } from "@/types";
import { useEffect } from "react";
import AddGrantButton from "./addGrants";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GrantsTable() {
  const { grants, fetchGrants } = useGrantStore();

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);
  return (
    <div>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="space-y-4 mt-25 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={grants} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </div>
  );
}
