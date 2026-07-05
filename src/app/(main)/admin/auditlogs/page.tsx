"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./logsDataTable";
import { useAuditLogStore } from "@/store/useAuditLogStore";
import { columns } from "./columns";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AuditLogsPage() {
  const { logs, isLoading, error, totalPages, currentPage, fetchLogs } =
    useAuditLogStore();

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Always reset to page 1 when searching
      fetchLogs(1, 10, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchLogs]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4 ml-4">
        System Audit Logs
      </h1>

      {/* 3. Pass everything into your shiny new generic table */}
      <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
        <ScrollArea className="h-full">
          <DataTable
            columns={columns}
            data={logs}
            isLoading={isLoading}
            error={error}
            // Search Props
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by table name..."
            // Pagination Props
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={() => fetchLogs(currentPage + 1, 10, searchTerm)}
            onPreviousPage={() => fetchLogs(currentPage - 1, 10, searchTerm)}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
