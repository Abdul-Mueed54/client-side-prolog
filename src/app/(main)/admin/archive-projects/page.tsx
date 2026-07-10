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
        <div className="flex justify-end p-5 item-center">
          <Link
            className="bg-brand rounded w-35 h-12 border border-black flex justify-center items-center hover:bg-brand/90 hover:shadow-2xl transition"
            href={"/staff"}
          >
            + Add Projects
          </Link>
        </div>

        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className=" h-full">
            <DataTable columns={columns} data={projects} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </div>
  );
}
