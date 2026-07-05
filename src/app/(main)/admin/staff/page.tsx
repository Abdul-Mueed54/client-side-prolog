"use client";

import { useStaffStore } from "@/store/useStaffStore";
import { columns } from "./columns";
import { DataTable } from "./staffDataTable";
import { useEffect } from "react";
import StaffFilters from "./staffFilter";
import AddStaffButton from "./addStaff";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StaffUsersTable() {
  const { staff, fetchStaff, addStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, addStaff]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-5 item-center">
          <AddStaffButton />
        </div>
        <div className="flex justify-center">
          <StaffFilters />
        </div>
        <div className="space-y-4 h-115 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={staff} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
