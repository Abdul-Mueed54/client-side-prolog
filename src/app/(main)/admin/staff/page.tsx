"use client";

import { useStaffStore } from "@/store/useStaffStore";
import { columns } from "./columns";
import { DataTable } from "./staffDataTable";
import { useEffect } from "react";
import StaffFilters from "./staffFilter";
import AddStaffButton from "./addStaff";

export default function StaffUsersTable() {
  const { staff, fetchStaff, addStaff } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, addStaff]);
  return (
    <>
      <div className="flex justify-end p-5 item-center">
        <AddStaffButton />
      </div>
      <div className="flex justify-center">
        <StaffFilters />
      </div>
      <div className="container mx-auto ">
        <DataTable columns={columns} data={staff} />
      </div>
    </>
  );
}
