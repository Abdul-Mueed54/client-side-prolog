"use client";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Departments } from "@/types";
import { useDepartmentStore } from "@/store/useDeptStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface DepartmentActionsProps {
  department: Departments;
}

export function DepartmentActions({ department }: DepartmentActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-orange-400 font-bold">Actions</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuItem
            onClick={() => {
              setTimeout(() => setIsEditOpen(true), 50);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => {
              setTimeout(() => setIsDeleteOpen(true), 50);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/**/}
      {/* <EditDepartmentDialog */}
      {/*   faculty={faculty} */}
      {/*   open={isEditOpen} */}
      {/*   onOpenChange={setIsEditOpen} */}
      {/* /> */}
      {/**/}
      {/* <DeleteDepartmentDialog */}
      {/*   faculty={faculty} */}
      {/*   open={isDeleteOpen} */}
      {/*   onOpenChange={setIsDeleteOpen} */}
      {/* /> */}
    </>
  );
}

