"use client";

import { useGrantStore } from "@/store/useGrantsStore";
import { columns } from "./columns";
import { DataTable } from "./grantsDataTable";
import { Project } from "@/types";
import { useEffect } from "react";
import AddGrantButton from "./addGrants";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";

export default function GrantsTable() {
  const { grants, fetchGrants } = useGrantStore();

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);
  return (
    <>
    <ProtectedRoute allowedRoles={["admin"]}>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={grants} />
      </div>
    </ProtectedRoute>
    </>
  );
}
