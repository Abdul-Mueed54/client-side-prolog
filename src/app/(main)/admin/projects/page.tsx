"use client";

import { useEffect } from "react";
import { useAdminProjectStore } from "@/store/useAdminProjectStore";
import { columns } from "./columns";
import { DataTable } from "./projectsDataTable";
import Link from "next/link";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminProjectsTable() {
  // Pull from the ADMIN store, not the Main Window store
  const { adminProjects, fetchAdminProjects } = useAdminProjectStore();

  // Fetch data on mount
  useEffect(() => {
    fetchAdminProjects(1);
  }, [fetchAdminProjects]);

  return (
    <div>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-5 item-center">
          <Link
            className="bg-brand rounded w-35 h-12 border border-black flex justify-center items-center hover:shadow-2xl transition"
            href={"/staff"}
          >
            + Add Projects
          </Link>
        </div>

        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className=" h-full">
            <DataTable columns={columns} data={adminProjects} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </div>
  );
}
