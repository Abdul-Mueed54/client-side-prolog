"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Industry } from "@/types";

export const columns: ColumnDef<Industry>[] = [
  {
    accessorKey: "id",
    header: "Industry ID",
  },
  {
    accessorKey: "name",
    header: "Industry Name",
  },
  {
    accessorKey: "email",
    header: "Industry Email",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "type",
    header: "Industry Type",
  },
];
