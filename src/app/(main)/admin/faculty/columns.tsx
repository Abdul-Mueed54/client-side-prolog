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
    accessorKey: "facultyName",
    header: "Faculty Name",
  },
  {
    accessorKey: "facultyEmail",
    header: "Faculty Email",
  },
  {
    accessorKey: "deptAbbreviation",
    header: "Department",
  },
];
