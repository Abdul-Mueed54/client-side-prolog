"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Grants } from "@/types";

export const columns: ColumnDef<Grants>[] = [
  {
    accessorKey: "projectId",
    header: "Project ID",
  },
  {
    accessorKey: "grantName",
    header: "Grant Name",
  },
  {
    accessorKey: "recievedDate",
    header: "Received Date",
  },
  {
    accessorKey: "grantAmount",
    header: "Amount",
  },
  {
    accessorKey: "industryName",
    header: "Industry Name",
  },
];
