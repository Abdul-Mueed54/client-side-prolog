"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "../projects/projectsDataTable";
import Link from "next/link";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from "@/store/useProjectStore";

export default function AdminProjectsTable() {
  const { projects, fetchProjects } = useProjectStore();

  // Fetch data on mount
  useEffect(() => {
    fetchProjects(1, "", true);
  }, [fetchProjects]);

  return (
    <div>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className=" h-full">
            <DataTable columns={columns} data={projects} archiveProjects={true}/>
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </div>
  );
}
