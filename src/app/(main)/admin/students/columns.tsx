"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Students } from "@/types";
import { StudentActions } from "./action";

export const columns: ColumnDef<Students>[] = [
  {
    accessorKey: "seatNo",
    header: "Seat No",
  },
  {
    accessorKey: "stdName",
    header: "Student Name",
  },
  {
    accessorKey: "stdEmail",
    header: "Student Email",
  },
  {
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original

      return (
        <StudentActions student={student} />
      )
    },
  },


];
