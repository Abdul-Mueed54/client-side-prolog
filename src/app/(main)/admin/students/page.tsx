"use client";

import { useStudentStore } from "@/store/useStudentsStore";
import { columns } from "./columns";
import { DataTable } from "./studentsDataTable";
import { useEffect } from "react";
import AddStudentButton from "./addStudents";
import StudentFilters from "./studentsFilter";

export default function StudentsTable() {
  const { students, fetchStudents, addStudent } = useStudentStore();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, addStudent]);
  return (
    <>
      <div className="flex justify-end p-3 item-center">
        <AddStudentButton />
      </div>
      <div className="flex justify-center">
        <StudentFilters />
      </div>
      <div className="container ">
        <DataTable columns={columns} data={students} />
      </div>
    </>
  );
}
