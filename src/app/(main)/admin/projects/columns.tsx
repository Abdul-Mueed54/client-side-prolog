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
    accessorKey: "grants",
    header: "Grant",
    cell: ({ row }) => {
      // Extract the garnts name
      const grantName = row.getValue("grants") as
        | {
            name: string;
            amount: number;
          }[]
        | null;

      return (
        <div className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 flex justify-center items-center rounded">
          {grantName?.map((grant, index) =>
            grant.name === null ? (
              <span
                key={index}
                className="text-muted-foreground bg-black text-sm"
              >
                -
              </span>
            ) : (
              <div key={index} className="text-[10px] p-1">
                {grant.name}
              </div>
            ),
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "industries",
    header: "Industry",
    cell: ({ row }) => {
      // Extract the industry name
      const industryName = row.getValue("industries") as
        | {
            name: string;
            association: string;
          }[]
        | null;
      // console.log(industryName);

      return (
        <div className="bg-pink-100 text-pink-800 hover:bg-pink-100 dark:bg-pink-900 dark:text-pink-100 flex justify-center items-center rounded">
          {industryName?.map((industry, index) =>
            industry.name === null ? (
              <span
                key={index}
                className="text-muted-foreground bg-black text-sm"
              >
                -
              </span>
            ) : (
              <div key={index} className="text-[10px] p-1">
                {industry.name}
              </div>
            ),
          )}
        </div>
      );
    },
  },
];
