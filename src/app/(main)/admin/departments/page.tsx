"use client";

import { columns } from "./columns";
import { DataTable } from "./deptDataTable";
import { useEffect } from "react";
import { useDepartmentStore } from "@/store/useDeptStore";
import AddDepartmentButton from "./addDepts";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DeptTable() {
  const { departments, fetchDepartments, addDepartment } = useDepartmentStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments, addDepartment]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-5 item-center">
          <AddDepartmentButton />
        </div>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={departments} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
