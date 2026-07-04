"use client";

import React, { useEffect, useState } from "react";
import {
  Users, Users2, Building2, Briefcase, UserCheck,
  AlertTriangle, RefreshCcw, FileText, BarChart3,
  UserX, FolderX, Building
} from "lucide-react";
import { useReportStore } from "@/store/useReportStore";
import { Button } from "@/components/ui/button";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader } from "@/components/loader/loader";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminReportsPage() {
  const { summary, departmentStats, actionItems, isLoading, error, fetchReportData } = useReportStore();
  const [activeTab, setActiveTab] = useState<"overview" | "departments" | "action">("overview");

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // =======================================================================
  // MULTI-PAGE PDF GENERATOR
  // =======================================================================
  const handleExportPDF = () => {
    if (!summary || !actionItems) return;

    const doc = new jsPDF();
    const brandColor: [number, number, number] = [15, 23, 42];

    // --- PAGE 1: EXECUTIVE SUMMARY ---
    doc.setFontSize(22);
    doc.setTextColor(...brandColor);
    doc.text("FYDP System Analytics Report", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    doc.text("Report Type: Comprehensive System Overview & Integrity Audit", 14, 37);

    doc.setFontSize(14);
    doc.setTextColor(...brandColor);
    doc.text("1. Executive Summary", 14, 50);

    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Total Count']],
      body: [
        ['Registered Students', summary.totalStudents],
        ['Active Groups', summary.totalGroups],
        ['Academic Departments', summary.totalDepartments],
        ['Registered Industries', summary.totalIndustries],
        ['External Supervisors', summary.totalExternals],
      ],
      theme: 'striped',
      headStyles: { fillColor: brandColor },
      styles: { fontSize: 11, cellPadding: 6 },
    });

    // --- PAGE 2: DEPARTMENTAL ANALYSIS ---
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...brandColor);
    doc.text("2. Departmental Student Distribution", 14, 25);

    const deptBody = departmentStats.map(dept => [dept.deptAbbreviation, dept.studentCount]);

    autoTable(doc, {
      startY: 30,
      head: [['Department Abbreviation', 'Total Students']],
      body: deptBody.length > 0 ? deptBody : [['No data available', '-']],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    // --- PAGE 3: ACTION ITEMS & AUDIT ---
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...brandColor);
    doc.text("3. System Integrity & Action Items", 14, 25);

    let currentY = 35;

    // Sub-audit 1: Unassigned Students
    doc.setFontSize(12);
    if (actionItems.unassignedStudents.length > 0) {
      doc.setTextColor(220, 38, 38);
      doc.text(`Warning: ${actionItems.unassignedStudents.length} Student(s) without a Group`, 14, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Seat Number', 'Student Name']],
        body: actionItems.unassignedStudents.map(s => [s.seatNo, s.stdName]),
        theme: 'plain',
        headStyles: { fillColor: [220, 38, 38], textColor: 255 },
        styles: { fontSize: 10, lineColor: [220, 38, 38], lineWidth: 0.1 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text("Success: All students are assigned to groups.", 14, currentY);
      currentY += 15;
    }

    // Sub-audit 2: Unassigned Groups
    doc.setFontSize(12);
    if (actionItems.unassignedGroups.length > 0) {
      doc.setTextColor(220, 38, 38);
      doc.text(`Warning: ${actionItems.unassignedGroups.length} Group(s) without a Project`, 14, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Group ID', 'Group Leader']],
        body: actionItems.unassignedGroups.map(g => [`GRP-${g.groupId}`, g.groupLeader]),
        theme: 'plain',
        headStyles: { fillColor: [220, 38, 38], textColor: 255 },
        styles: { fontSize: 10, lineColor: [220, 38, 38], lineWidth: 0.1 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text("Success: All groups are assigned to projects.", 14, currentY);
      currentY += 15;
    }

    // Sub-audit 3: Empty Industries
    // Check if we need a new page before writing the last table
    if (currentY > 240) { doc.addPage(); currentY = 25; }

    doc.setFontSize(12);
    if (actionItems.emptyIndustries.length > 0) {
      doc.setTextColor(234, 179, 8); // Yellow/Warning color
      doc.text(`Notice: ${actionItems.emptyIndustries.length} Registered Industries without Externals`, 14, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Industry ID', 'Industry Name']],
        body: actionItems.emptyIndustries.map(i => [i.industryId, i.industryName]),
        theme: 'plain',
        headStyles: { fillColor: [234, 179, 8], textColor: 255 },
        styles: { fontSize: 10, lineColor: [234, 179, 8], lineWidth: 0.1 },
      });
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text("Success: All registered industries have active external supervisors.", 14, currentY);
    }

    doc.save("FYDP_Comprehensive_Report.pdf");
  };

  if (isLoading && !summary) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => fetchReportData()}>Try Again</Button>
      </div>
    );
  }

  return (
      <ScrollArea className="h-full flex-1">
    <div className="p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Reports Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export comprehensive FYDP insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchReportData()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-brand text-black hover:bg-brand/90 flex items-center gap-2 shadow"
          >
            <FileText className="w-4 h-4" />
            Export Comprehensive PDF
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<BarChart3 className="w-4 h-4" />} label="Executive Overview" />
        <TabButton active={activeTab === "departments"} onClick={() => setActiveTab("departments")} icon={<Building2 className="w-4 h-4" />} label="Departmental Stats" />
        <TabButton
          active={activeTab === "action"}
          onClick={() => setActiveTab("action")}
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Action Items"
          badgeCount={
            (actionItems?.unassignedGroups.length || 0) +
            (actionItems?.unassignedStudents.length || 0)
          }
        />
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ReportCard title="Total Students" value={summary?.totalStudents || 0} icon={<Users className="w-5 h-5 text-blue-600" />} bgClass="bg-blue-50" />
          <ReportCard title="Active Groups" value={summary?.totalGroups || 0} icon={<Users2 className="w-5 h-5 text-indigo-600" />} bgClass="bg-indigo-50" />
          <ReportCard title="Departments" value={summary?.totalDepartments || 0} icon={<Building2 className="w-5 h-5 text-purple-600" />} bgClass="bg-purple-50" />
          <ReportCard title="Registered Industries" value={summary?.totalIndustries || 0} icon={<Briefcase className="w-5 h-5 text-emerald-600" />} bgClass="bg-emerald-50" />
          <ReportCard title="External Supervisors" value={summary?.totalExternals || 0} icon={<UserCheck className="w-5 h-5 text-amber-600" />} bgClass="bg-amber-50" />
        </div>
      )}

      {/* TAB CONTENT: DEPARTMENTS */}
      {activeTab === "departments" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Department Abbreviation</th>
                <th className="px-6 py-4 font-semibold text-right">Enrolled Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentStats.map((dept) => (
                <tr key={dept.deptAbbreviation} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{dept.deptAbbreviation}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{dept.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: ACTION ITEMS */}
      {activeTab === "action" && actionItems && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Unassigned Students */}
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserX className={`w-5 h-5 ${actionItems.unassignedStudents.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                <h3 className="font-semibold text-slate-800">Unassigned Students</h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                {actionItems.unassignedStudents.length}
              </span>
            </div>
            <div className="p-0 overflow-y-auto max-h-[300px]">
              {actionItems.unassignedStudents.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {actionItems.unassignedStudents.map(student => (
                      <tr key={student.seatNo} className="hover:bg-red-50/30">
                        <td className="px-4 py-3 font-medium text-slate-900">{student.seatNo}</td>
                        <td className="px-4 py-3 text-slate-600">{student.stdName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState message="All students have been assigned to groups." />
              )}
            </div>
          </div>

          {/* Unassigned Groups */}
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FolderX className={`w-5 h-5 ${actionItems.unassignedGroups.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                <h3 className="font-semibold text-slate-800">Unassigned Groups</h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                {actionItems.unassignedGroups.length}
              </span>
            </div>
            <div className="p-0 overflow-y-auto max-h-[300px]">
              {actionItems.unassignedGroups.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {actionItems.unassignedGroups.map(group => (
                      <tr key={group.groupId} className="hover:bg-red-50/30">
                        <td className="px-4 py-3 font-medium text-slate-900">GRP-{group.groupId}</td>
                        <td className="px-4 py-3 text-slate-600">Leader: {group.groupLeader}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState message="All groups are assigned to projects." />
              )}
            </div>
          </div>

          {/* Empty Industries (Full Width) */}
          <div className="lg:col-span-2 border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className={`w-5 h-5 ${actionItems.emptyIndustries.length > 0 ? 'text-amber-500' : 'text-green-500'}`} />
                <h3 className="font-semibold text-slate-800">Industries Pending Externals</h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                {actionItems.emptyIndustries.length}
              </span>
            </div>
            <div className="p-0 overflow-y-auto max-h-[250px]">
              {actionItems.emptyIndustries.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {actionItems.emptyIndustries.map(ind => (
                      <tr key={ind.industryId} className="hover:bg-amber-50/30">
                        <td className="px-4 py-3 font-medium text-slate-900 w-24">ID: {ind.industryId}</td>
                        <td className="px-4 py-3 text-slate-600">{ind.industryName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState message="All industries have assigned external supervisors." />
              )}
            </div>
          </div>

        </div>
      )}
    </div>
      </ScrollArea>
  );
}

// Helper component for the KPI cards
function ReportCard({ title, value, icon, bgClass }: { title: string, value: number, icon: React.ReactNode, bgClass: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex items-start justify-between hover:border-brand/50 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bgClass}`}>
        {icon}
      </div>
    </div>
  );
}

// Helper component for Tabs
function TabButton({ active, onClick, icon, label, badgeCount }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badgeCount?: number }) {
  return (
    <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${active
      ? "border-brand text-brand bg-brand/5"
      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      }`}
    >
      {icon}
      {label}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="ml-1 bg-red-100 text-red-700 py-0.5 px-2 rounded-full text-[10px] font-bold">
          {badgeCount}
        </span>
      )}
    </button>
  );
}

// Helper component for Empty States
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-sm text-slate-500 text-center py-10 flex flex-col items-center">
      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
        <UserCheck className="w-5 h-5" />
      </div>
      <p>{message}</p>
    </div>
  );
}
