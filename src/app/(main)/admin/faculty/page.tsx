"use client";

import { useFacultyStore } from "@/store/useFacultyStore";
import { columns } from "./columns";
import { DataTable } from "./facultyDataTable";
import { useEffect } from "react";
import AddFacultyButton from "./addFaculty";
import FacultyFilters from "./facultyFilters";

export default function InternalSupervisorsTable() {
  const { faculty, fetchFaculty, addFaculty } = useFacultyStore();

  useEffect(() => {
    fetchFaculty({});
  }, [fetchFaculty, addFaculty]);
  return (
    <>
      <div className="flex justify-end p-3 item-center">
        <AddFacultyButton />
      </div>
      <div className="flex justify-center">
        <FacultyFilters />
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={faculty} />
      </div>
    </>
  );
}
//
