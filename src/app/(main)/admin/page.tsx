"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  FolderGit2,
  GraduationCap,
  Users,
  Building2,
  Network,
  Layers,
  ShieldCheck,
  UserCheck,
  Briefcase,
} from "lucide-react";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import { Loader } from "@/components/loader/loader";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchStats(token);
    }
  }, [token, fetchStats]);

  if (isLoading) {
    return <Loader />;
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
  };

  // Upgraded StatCard with subtle color accents
  const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    colorTheme = "orange",
  }: any) => {
    // Define color classes based on the theme prop
    const themes: any = {
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-100",
        hover: "hover:border-l-orange-500",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-100",
        hover: "hover:border-l-indigo-500",
      },
      slate: {
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        hover: "hover:border-l-slate-500",
      },
    };

    const theme = themes[colorTheme] || themes.slate;

    return (
      <div
        className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent ${theme.hover}`}
      >
        <div
          className={`p-3 rounded-lg border ${theme.bg} ${theme.text} ${theme.border}`}
        >
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
          {subtitle && (
            <span className="text-xs text-slate-400 mt-0.5">{subtitle}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ScrollArea className="h-full">
        <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900">
              System Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time metrics and catalog statistics for ProLog.
            </p>
          </div>

          <div className="space-y-10">
            {/* SECTION 1: Core Metrics (Orange Theme) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Core Catalog
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Total Projects"
                  value={data.totalProject}
                  icon={FolderGit2}
                  subtitle="Cataloged in system"
                  colorTheme="orange"
                />
                <StatCard
                  title="Total Students"
                  value={data.totalStudent}
                  icon={GraduationCap}
                  colorTheme="orange"
                />
              </div>
            </section>

            {/* SECTION 2: Academic Network (Indigo Theme) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Academic & Industry Network
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Total Faculty"
                  value={data.totalFaculty}
                  icon={Users}
                  colorTheme="indigo"
                />
                <StatCard
                  title="Supervising Faculty"
                  value={data.totalSupervisingFaculty}
                  icon={UserCheck}
                  subtitle="Actively assigned"
                  colorTheme="indigo"
                />
                <StatCard
                  title="Total Industries"
                  value={data.totalIndustries}
                  icon={Building2}
                  subtitle="Active partnerships"
                  colorTheme="indigo"
                />
                <StatCard
                  title="External Supervisors"
                  value={data.totalExternals}
                  icon={Briefcase}
                  colorTheme="indigo"
                />
              </div>
            </section>

            {/* SECTION 3: Infrastructure & Admin (Slate Theme) */}
            <section>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  System & Infrastructure
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Departments"
                  value={data.totalDept}
                  icon={Network}
                  colorTheme="slate"
                />
                <StatCard
                  title="Domains"
                  value={data.totalDomain}
                  icon={Layers}
                  subtitle="Research areas"
                  colorTheme="slate"
                />
                <StatCard
                  title="Total System Users"
                  value={data.totalUsers}
                  icon={ShieldCheck}
                  colorTheme="slate"
                />
                <StatCard
                  title="Staff Accounts"
                  value={data.totalStaff}
                  icon={Users}
                  colorTheme="slate"
                />
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </ProtectedRoute>
  );
}
