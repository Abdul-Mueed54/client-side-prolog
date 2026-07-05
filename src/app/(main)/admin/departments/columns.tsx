"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Departments } from "@/types";
import { DepartmentActions } from "./actions";

export const columns: ColumnDef<Departments>[] = [
  {
    accessorKey: "deptAbbreviation",
    header: "Department Abbreviation",
  },
  {
    accessorKey: "deptName",
    header: "Department Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const department = row.original;

      return <DepartmentActions department={department} />;
    },
  },
];
