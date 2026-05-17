"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Faculty } from "@/types";

export const columns: ColumnDef<Faculty>[] = [
  {
    accessorKey: "facultyId",
    header: "Faculty ID",
  },
  {
    accessorKey: "facultyContactNo",
    header: "Contact No",
  },
  {
    accessorKey: "facultyName",
    header: "Faculty Name",
  },
  {
    accessorKey: "facultyEmail",
    header: "Faculty Email",
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
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
];
