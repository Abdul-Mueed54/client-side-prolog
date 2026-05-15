"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Grants } from "@/types";

export const columns: ColumnDef<Grants>[] = [
  {
    accessorKey: "projectId",
    header: "Project ID",
  },
  {
    accessorKey: "name",
    header: "Grant Name",
  },
  {
    accessorKey: "recievedDate",
    header: "Received Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "industryId",
    header: "Industry ID",
  },
];
