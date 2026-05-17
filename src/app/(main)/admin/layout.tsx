import React from "react";
import AdminSidebar from "@/components/layouts/adminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">

      <aside className="w-[250px] min-w-[250px] bg-white border-r border-black flex flex-col">
        <div className="p-3.5 border-b border-black/10">
          <div className="text-[13px] font-medium">ADMIN PANEL</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminSidebar />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#eeeeee]">
        {children}
      </main>
    </div>
  );
}
