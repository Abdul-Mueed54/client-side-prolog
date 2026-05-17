"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  UserCheck,
  Briefcase,
  Building2,
  Banknote,
  Network,
  UserCog,
  Hotel,
  User,
} from "lucide-react";
import { useAdminProjectStore } from "@/store/useAdminProjectStore";
import { useDomainsStore } from "@/store/useDomainStore";
import { useGrantStore } from "@/store/useGrantsStore";
import { useIndustryStore } from "@/store/useIndustryStore";
import { useStudentStore } from "@/store/useStudentsStore";
import { useDepartmentStore } from "@/store/useDeptStore";
import { useGroupStore } from "@/store/useGroupStore";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { totalRecords } = useAdminProjectStore();
  const { departments } = useDepartmentStore();
  const { totalStudents } = useStudentStore();
  const { domains } = useDomainsStore();
  const { grants } = useGrantStore();
  const { industries } = useIndustryStore();
  const { groups } = useGroupStore();
  // --- NAVIGATION DATA ---
  const ADMIN_NAV = [
    {
      section: "Overview",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        {
          name: "Project Catalog",
          href: "/admin/projects",
          icon: FolderOpen,
          badge: totalRecords,
        },
      ],
    },
    {
      section: "Master Records",
      items: [
        {
          name: "Students",
          href: "/admin/students",
          icon: User,
          badge: totalStudents,
        },
        {
          name: "Groups",
          href: "/admin/groups",
          icon: Users,
          badge: groups.length,
        },
        {
          name: "Faculty",
          href: "/admin/faculty",
          icon: UserCheck,
          badge: 6,
        },
        {
          name: "External Supervisors",
          href: "/admin/external",
          icon: Briefcase,
          badge: 4,
        },
        {
          name: "Industries",
          href: "/admin/industries",
          icon: Building2,
          badge: industries.length,
        },
        {
          name: "Departments",
          href: "/admin/departments",
          icon: Hotel,
          badge: departments.length,
        },
        {
          name: "Grants",
          href: "/admin/grants",
          icon: Banknote,
          badge: grants.length,
        },
        {
          name: "Domains",
          href: "/admin/domains",
          icon: Network,
          badge: domains.length,
        },
      ],
    },
    {
      section: "System",
      items: [
        { name: "Staff Users", href: "/admin/staff", icon: UserCog, badge: 3 },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {ADMIN_NAV.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-4">
          {/* Section Header */}
          <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {group.section}
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-[15px] cursor-pointer mx-1.5 transition-colors ${
                    isActive
                      ? "bg-[#FAEEDA] text-[#633806] font-medium" // Active styles from your HTML
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // Inactive styles
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className="w-4 h-4"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span>{item.name}</span>
                  </div>

                  {/* Badge Counter (if it exists) */}
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#EF9F27] text-[#412402] font-bold"
                          : "bg-slate-200 text-slate-500 font-medium"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
