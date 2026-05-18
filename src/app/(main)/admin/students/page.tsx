"use client";

import { useStudentStore } from "@/store/useStudentsStore";
import { columns } from "./columns";
import { DataTable } from "./studentsDataTable";
import { useEffect } from "react";
import AddStudentButton from "./addStudents";
import StudentFilters from "./studentsFilter";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";

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
      <div className="container ">
        <DataTable columns={columns} data={students} />
      </div>
    </ProtectedRoute>
    </>
  );
}
