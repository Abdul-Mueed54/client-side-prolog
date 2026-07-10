// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
// import { buttonVariants } from "@/components/ui/button";
// import { toast } from "sonner";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// // Assuming you have a project store now instead of using the industry store
// import { useProjectStore } from "@/store/useProjectStore";
// import { Project } from "@/types";

// interface ProjectActionsProps {
//   project: Project;
// }

// export function ProjectActions({ project }: ProjectActionsProps) {
//   const router = useRouter();
//   const [isArchiveOpen, setIsArchiveOpen] = useState(false);

//   return (
//     <>
//       <DropdownMenu>

//         <DropdownMenuTrigger
//           className={buttonVariants({
//             variant: "ghost",
//             className: "h-8 w-8 p-0",
//           })}
//         >
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end">
//           <DropdownMenuGroup>
//             <DropdownMenuLabel className="text-orange-400 font-bold">
//               Actions
//             </DropdownMenuLabel>
//           </DropdownMenuGroup>

//           <DropdownMenuItem
//             onClick={() => {
//               navigator.clipboard.writeText(project.id);
//               toast.success("Project ID copied!");
//             }}
//           >
//             <Copy className="mr-2 h-4 w-4 text-slate-500" />
//             <span>Restore Project</span>
//           </DropdownMenuItem>



//       <RestoreProjectDialog
//         project={project}
//         open={isArchiveOpen}
//         onOpenChange={setIsArchiveOpen}
//         />
//         </DropdownMenu>
//     </>
//   );
// }

// // ARCHIVE DIALOG
// {/* interface ArchiveProjectDialogProps {
//   project: Project;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// } */}

// function RestoreProjectDialog({
//   project,
//   open,
//   onOpenChange,
// }: ArchiveProjectDialogProps) {
//   // Replace this with your actual project store hook
//   const archiveProject = useProjectStore((state) => state.archiveProject);
//   const [isArchiving, setIsArchiving] = useState(false);

//   const handleArchive = async () => {
//     setIsArchiving(true);
//     try {
//       // This function in your store should call a PATCH endpoint to flip `is_deleted = true`
//       await archiveProject(project.id);
//       onOpenChange(false);
//       toast.success(`Project archived successfully.`);
//     } catch (error: any) {
//       toast.error(error.message || "Failed to archive project.");
//     } finally {
//       setIsArchiving(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Archive "{project?.title}"?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will remove the project from the active directory. The project is not permanently deleted and can be restored later from the <strong>Archive</strong> section.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleArchive}
//             disabled={isArchiving}
//             className="bg-red-600 hover:bg-red-700"
//           >
//             {isArchiving ? "Archiving..." : "Archive Project"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }