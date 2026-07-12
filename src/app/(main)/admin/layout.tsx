import React from "react";
import AdminSidebar from "@/components/layouts/adminSideBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>

    <div className="flex h-160">
      <aside className="w-[250px] min-w-[250px] bg-white border-r border-black flex flex-col">
        <div className="p-3.5 border-b border-black/10">
          <div className="text-[13px] font-medium">ADMIN PANEL</div>
        </div>
        <div className="flex-1">
          <AdminSidebar />
        </div>
      </aside>
        <ScrollArea className="flex-1">

      <main className="h-screen bg-[#eeeeee]">{children}</main>
        </ScrollArea>
    </div>
    </ProtectedRoute>
  );
}
