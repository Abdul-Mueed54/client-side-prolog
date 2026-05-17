"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Industry } from "@/types";

export const columns: ColumnDef<Industry>[] = [
  {
    accessorKey: "industryId",
    header: "Industry ID",
  },
  {
    accessorKey: "industryName",
    header: "Industry Name",
  },
  {
    accessorKey: "industryEmail",
    header: "Industry Email",
  },
  {
    accessorKey: "industryLocation",
    header: "Location",
  },
  {
    accessorKey: "industryType",
    header: "Industry Type",
  },
];
