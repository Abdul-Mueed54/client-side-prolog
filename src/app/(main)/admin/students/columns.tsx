"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Students } from "@/types";

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
];
