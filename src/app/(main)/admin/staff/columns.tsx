"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Staff } from "@/types";

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "staffId",
    header: "Staff ID",
  },
  {
    accessorKey: "staffName",
    header: "Staff Name",
  },
  {
    accessorKey: "staffEmail",
    header: "Staff Email",
  },
  {
    accessorKey: "staffContactNo",
    header: "Contact No",
  },
  {
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <div
          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
];
