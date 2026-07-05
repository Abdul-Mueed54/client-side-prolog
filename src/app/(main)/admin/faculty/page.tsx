"use client";

import { useFacultyStore } from "@/store/useFacultyStore";
import { columns } from "./columns";
import { DataTable } from "./facultyDataTable";
import { useEffect } from "react";
import AddFacultyButton from "./addFaculty";
import FacultyFilters from "./facultyFilters";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InternalSupervisorsTable() {
  const { faculty, fetchFaculty, addFaculty } = useFacultyStore();

  useEffect(() => {
    fetchFaculty({});
  }, [fetchFaculty, addFaculty]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-3 item-center">
          <AddFacultyButton />
        </div>
        <div className="flex justify-center">
          <FacultyFilters />
        </div>
        <div className="space-y-4 h-120 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className="h-full">
            <DataTable columns={columns} data={faculty} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
//
