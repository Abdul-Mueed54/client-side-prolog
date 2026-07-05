"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Groups } from "@/types";
import { GroupActions } from "./action";
import { group } from "console";

export const columns: ColumnDef<Groups>[] = [
  {
    accessorKey: "groupId",
    header: "Group ID",
  },

  {
    accessorKey: "groupLeader",
    header: "Student 1",
  },
  {
    accessorKey: "member2",
    header: "Student 2",
  },
  {
    accessorKey: "member3",
    header: "Student 3",
  },
  {
    accessorKey: "member4",
    header: "Student 4",
  },
  {
    accessorKey: "projectId",
    header: "Project Id",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const group = row.original;

      return <GroupActions group={group} />;
    },
  },
];
