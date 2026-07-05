"use client";

import { useGroupStore } from "@/store/useGroupStore";
import { columns } from "./columns";
import { DataTable } from "./groupsDataTable";
import { useEffect } from "react";
import AddGroupButton from "./addGroups";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GroupsTable() {
  const { groups, fetchGroups, addGroup } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, addGroup]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-3 item-center">
          <AddGroupButton />
        </div>
        <div className="space-y-4 h-125 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={groups} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
