"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Project } from "@/types";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "Project ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // Automatically aligns the button to the left to match table headers
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "supervisors", // Make sure this matches your interface key
    header: "Supervisors",
    cell: ({ row }) => {
      const supervisors = row.getValue("supervisors") as string[];

      // Safety check in case the array is empty or undefined
      if (!supervisors || supervisors.length === 0)
        return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col space-y-1">
          {supervisors.map((name, index) => (
            <span key={index} className="text-sm">
              {name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
  {
    accessorKey: "domains",
    header: "Domains",
    cell: ({ row }) => {
      // Extract the array of domains from the row
      const domains = row.getValue("domains") as string[];

      return (
        <div className="flex flex-wrap gap-1">
          {domains.map((domain) => (
            <Badge key={domain} variant="outline" className="text-[10px]">
              {domain}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isSponsored",
    header: "Sponsored",
    cell: ({ row }) => {
      // Extract the boolean value
      const isSponsored = row.getValue("isSponsored") as boolean;

      return isSponsored ? (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
        >
          Sponsored
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
];
