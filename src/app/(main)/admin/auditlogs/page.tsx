"use client";

import { columns } from "./columns";
import { DataTable } from "./deptDataTable";
import { useEffect } from "react";
import { useAuditLogStore } from "@/store/useAuditLogStore";

export default function DeptTable() {
  const { logs, fetchLogs } = useAuditLogStore();

  // Fetch data on mount
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={logs} />
      </div>
    </>
  );
}
