"use client";

import { columns } from "./columns";
import { DataTable } from "./deptDataTable";
import { useEffect } from "react";
import { useDepartmentStore } from "@/store/useDeptStore";
import AddDepartmentButton from "./addDepts";

export default function DeptTable() {
  const { departments, fetchDepartments, addDepartment } = useDepartmentStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments, addDepartment]);
  return (
    <>
      <div className="flex justify-end p-5 item-center">
        <AddDepartmentButton />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={departments} />
      </div>
    </>
  );
}
