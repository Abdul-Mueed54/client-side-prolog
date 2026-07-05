"use client";

import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { toast } from "sonner";
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

import { useGroupStore } from "@/store/useGroupStore";
// Adjust import path based on your Group type location
import { Groups } from "@/types";

interface GroupActionsProps {
  group: Groups;
}

export function GroupActions({ group }: GroupActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            variant: "ghost",
            className: "h-8 w-8 p-0",
          })}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-orange-400 font-bold">
              Actions
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(group.groupId.toString());
              toast.success("Group ID copied!");
            }}
          >
            Copy Group ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

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

      <EditGroupDialog
        group={group}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteGroupDialog
        group={group}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}

interface EditGroupDialogProps {
  group: Groups;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditGroupDialog({ group, open, onOpenChange }: EditGroupDialogProps) {
  const updateGroup = useGroupStore((state) => state.updateGroup);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groupLeader: group.groupLeader || "",
    member2: group.member2 || "",
    member3: group.member3 || "",
    member4: group.member4 || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto upper case just like the creation form
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      await updateGroup(group.groupId.toString(), formData);
      onOpenChange(false);
      toast.success("Group updated successfully!");
    } catch (error: any) {
      console.error("Failed to update group:", error);
      setApiError(
        error.message || "Failed to update group. Please check seat numbers.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setApiError(null);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Group {group.groupId}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Group Leader (Seat No)
            </label>
            <input
              required
              type="text"
              name="groupLeader"
              value={formData.groupLeader}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 2 (Seat No)
            </label>
            <input
              type="text"
              name="member2"
              value={formData.member2}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 3 (Seat No)
            </label>
            <input
              type="text"
              name="member3"
              value={formData.member3}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Student 4 (Seat No)
            </label>
            <input
              type="text"
              name="member4"
              value={formData.member4}
              onChange={handleChange}
              placeholder="e.g. CS-24117"
              className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-slate-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand/90 rounded-md transition-colors shadow hover:shadow-2xl"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteGroupDialogProps {
  group: Groups;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
}: DeleteGroupDialogProps) {
  const deleteGroup = useGroupStore((state) => state.deleteGroup);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGroup(group.groupId.toString());
      onOpenChange(false);
      toast.success(`Group ${group.groupId} deleted successfully.`);
    } catch (error: any) {
      console.error("Failed to delete group:", error);
      toast.error(error.message || "Failed to delete group.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group {group.groupId}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete this group? This action
            will disband the students. If they are assigned to a project, the
            deletion will fail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
