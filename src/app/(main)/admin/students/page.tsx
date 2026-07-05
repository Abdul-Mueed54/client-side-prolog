"use client";

import { useStudentStore } from "@/store/useStudentsStore";
import { columns } from "./columns";
import { DataTable } from "./studentsDataTable";
import { useEffect } from "react";
import AddStudentButton from "./addStudents";
import StudentFilters from "./studentsFilter";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StudentsTable() {
  const { students, fetchStudents, addStudent } = useStudentStore();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, addStudent]);
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex justify-end p-3 item-center">
          <AddStudentButton />
        </div>
        <div className="flex justify-center">
          <StudentFilters />
        </div>
        <div className="space-y-4 h-120 max-w-280 rounded-md overflow-x-auto bg-[#ffffff] m-4">
          <ScrollArea className=" h-full">
            <DataTable columns={columns} data={students} />
          </ScrollArea>
        </div>
      </ProtectedRoute>
    </>
  );
}
