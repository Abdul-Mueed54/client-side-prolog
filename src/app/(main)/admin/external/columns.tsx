"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Externals } from "@/types";

export const columns: ColumnDef<Externals>[] = [
  {
    accessorKey: "extName",
    header: "External Name",
  },

  {
    accessorKey: "extEmail",
    header: "External Email",
  },
  {
    accessorKey: "extDesignation",
    header: "Designation",
  },
  {
    accessorKey: "industryId",
    header: "Industry Id",
  },
  {
    accessorKey: "industryName",
    header: "Industry Name",
  },
];
