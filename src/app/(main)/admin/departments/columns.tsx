"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Departments } from "@/types";

export const columns: ColumnDef<Departments>[] = [
  {
    accessorKey: "deptAbbreviation",
    header: "Department Abbreviation",
  },
  {
    accessorKey: "deptName",
    header: "Department Name",
  },
];
