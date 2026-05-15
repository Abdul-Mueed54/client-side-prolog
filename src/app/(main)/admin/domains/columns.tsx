"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Domains } from "@/types";

export const columns: ColumnDef<Domains>[] = [
  {
    accessorKey: "id",
    header: "Domain ID",
  },
  {
    accessorKey: "name",
    header: "Domain Name",
  },
  {
    accessorKey: "description",
    header: "Domain Description",
  },
  {
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
];
