"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Domains } from "@/types";

export const columns: ColumnDef<Domains>[] = [
  {
    accessorKey: "domainId",
    header: "Domain ID",
  },
  {
    accessorKey: "domainName",
    header: "Domain Name",
  },
  {
    accessorKey: "domainDescription",
    header: "Domain Description",
  },
  {
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
];
