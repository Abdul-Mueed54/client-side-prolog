"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Grants } from "@/types";
import { format } from "date-fns";

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
    cell: ({ row }) => {
      const rawDate = row.getValue("recievedDate") as string | undefined;

      if (!rawDate) {
        return <span>Unknown Date</span>;
      }

      const date = new Date(rawDate);

      return <span>{format(date, "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "grantAmount",
    header: "Amount",
  },
  {
    accessorKey: "industryName",
    header: "Industry Name",

    cell: ({ row }) => {
      const industry = row.getValue("industryName") as string;
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border bg-pink-50 text-pink-700 border-pink-200`}
        >
          {industry}
        </span>
      );
    },
  },
];
