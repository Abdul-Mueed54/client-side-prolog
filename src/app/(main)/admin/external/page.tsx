"use client";

import { useExternalStore } from "@/store/useExternalStore";
import { columns } from "./columns";
import { DataTable } from "./externalsDataTable";
import { useEffect } from "react";
import AddExternalButton from "./addExternal";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ExternalSupervisorsTable() {
  const { externals, fetchExternals, addExternal } = useExternalStore();

  useEffect(() => {
    fetchExternals();
  }, [fetchExternals, addExternal]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-3 item-center">
          <AddExternalButton />
        </div>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={externals} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
