import React from "react";
import AdminSidebar from "@/components/layouts/adminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      {/* LEFT COLUMN: Sidebar */}
      <div className="w-[250px] min-w-[250px] bg-white border-r border-black flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-black/10">
          <div className="text-[13px] font-medium">ADMIN PANEL</div>
        </div>
        <AdminSidebar />
      </div>

      {/* RIGHT COLUMN: Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#eeeeee]">
        {children}
      </main>
    </div>
  );
}
