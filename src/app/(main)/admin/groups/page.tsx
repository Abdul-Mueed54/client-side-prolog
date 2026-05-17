"use client";

import { useGroupStore } from "@/store/useGroupStore";
import { columns } from "./columns";
import { DataTable } from "./groupsDataTable";
import { useEffect } from "react";
import AddGroupButton from "./addGroups";


export default  function GroupsTable() {
  const { groups, fetchGroups, addGroup } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, addGroup]);
return (
    <>
      <div className="flex justify-end p-3 item-center">
        <AddGroupButton />
      </div>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={groups} />
    </div>
    </>
  );
}
