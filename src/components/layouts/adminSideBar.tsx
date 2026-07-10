"use client";

import React, { useEffect } from "react";
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
  CopyCheck,
  ShieldCogCorner,
  Loader2,
  FileArchive,
} from "lucide-react";
import LogoutButton from "../logoutButton/logout";
import { ScrollArea } from "../ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { stats, isLoading, error, fetchStats } = useDashboardStore();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchStats(token);
    }
  }, [token, fetchStats]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 mt-10">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100">
          Failed to load dashboard: {error}
        </div>
      </div>
    );
  }

  const data = stats || {
    totalProject: 0,
    totalStudent: 0,
    totalFaculty: 0,
    totalSupervisingFaculty: 0,
    totalIndustries: 0,
    totalExternals: 0,
    totalDept: 0,
    totalDomain: 0,
    totalUsers: 0,
    totalStaff: 0,
    totalGrants: 0,
    totalGroups: 0,
    totalLogs: 0,
    archivedProject: 0,
  };
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
          badge: data.totalProject,
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
          badge: data.totalStudent,
        },
        {
          name: "Groups",
          href: "/admin/groups",
          icon: Users,
          badge: data.totalGroups,
        },
        {
          name: "Faculty",
          href: "/admin/faculty",
          icon: UserCheck,
          badge: data.totalFaculty,
        },
        {
          name: "External Supervisors",
          href: "/admin/external",
          icon: Briefcase,
          badge: data.totalExternals,
        },
        {
          name: "Industries",
          href: "/admin/industries",
          icon: Building2,
          badge: data.totalIndustries,
        },
        {
          name: "Departments",
          href: "/admin/departments",
          icon: Hotel,
          badge: data.totalDept,
        },
        {
          name: "Grants",
          href: "/admin/grants",
          icon: Banknote,
          badge: data.totalGrants,
        },
        {
          name: "Domains",
          href: "/admin/domains",
          icon: Network,
          badge: data.totalDomain,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          name: "Staff Users",
          href: "/admin/staff",
          icon: UserCog,
          badge: data.totalStaff,
        },
        {
          name: "Report",
          href: "/admin/reports",
          icon: CopyCheck,
        },
      ],
    },
    {
      section: "Archive",
      items: [
        {
          name: "Projects",
          href: "/admin/archive-projects",
          icon: FileArchive,
          badge: data.archivedProject

        },
      ],
    },
    {
      section: "Audits",
      items: [
        {
          name: "Audit Logs",
          href: "/admin/auditlogs",
          icon: ShieldCogCorner,
          badge: data.totalLogs,
        },
      ],
    },
  ];

  return (
    <>
      <div className="flex flex-col max-h-screen">
        {/* Scrollable Navigation Area */}
        <ScrollArea className="flex-1 h-full">
          <div className="py-2 h-134">
            {ADMIN_NAV.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-4">
                <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.section}
                </div>

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
                            ? "bg-[#FAEEDA] text-[#633806] font-medium"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className="w-4 h-4"
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span>{item.name}</span>
                        </div>

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
        </ScrollArea>
      </div>

      <div className="p-2 border-t border-slate-200 mb-2">
        <LogoutButton />
      </div>
    </>
  );
}
