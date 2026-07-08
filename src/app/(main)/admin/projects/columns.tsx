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
      const supervisors = row.getValue("supervisors") as {
        role: string;
        name: string;
      }[];

      // Safety check in case the array is empty or undefined
      if (!supervisors || supervisors.length === 0)
        return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col space-y-1">
          {supervisors.map((name, index) => (
            <span key={index} className="text-sm">
              {name.name}
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
  accessorKey: "grants",
  header: "Grant",
  cell: ({ row }) => {
    const grants = row.getValue("grants") as | { name: string; association: string }[] | null;
    if (!grants || grants.length === 0) {
      return <span className="text-slate-400">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {grants.map((grant, index) =>
          !grant.name ? (
            <span key={index} className="text-slate-400"> - </span>) : (
            <div key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border bg-green-50 text-green-700 border-green-200">
              {grant.name}
            </div> ))}
      </div>
    );
  },
  },
  {
  accessorKey: "industries",
  header: "Industry",
  cell: ({ row }) => {
    const industries = row.getValue("industries") as | { name: string; association: string }[] | null;

    if (!industries || industries.length === 0) {
      return <span className="text-slate-400">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {industries.map((industry, index) =>
          !industry.name ? (
            <span key={index} className="text-slate-400">-</span> ) : (
            <div key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border bg-pink-50 text-pink-700 border-pink-200">
              {industry.name}
            </div> ) )}
      </div>
    );
  },

  },
];
