"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Mail,
  Key,
  Shield,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import LeftSide from "@/components/login/LeftSide";

type Role = "faculty" | "staff" | "admin";

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<Role>("faculty");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login action - redirect to projects page
    window.location.href = "/projects";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-d">
      {/* ========================================= */}
      {/* LEFT SIDE: Info & Guest Access            */}
      {/* ========================================= */}
      <LeftSide />

      {/* ========================================= */}
      {/* RIGHT SIDE: Authentication Form           */}
      {/* ========================================= */}
      <div className="w-full md:w-7/12 bg-white p-8 md:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Please sign in to access your portal.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex w-full mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveRole("faculty")}
              className={`flex-1 pb-4 text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeRole === "faculty"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-l hover:text-slate-m"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Faculty
            </button>
            <button
              onClick={() => setActiveRole("staff")}
              className={`flex-1 pb-4 text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeRole === "staff"
                  ? "border-[#EF9F27] text-[#EF9F27]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Staff
            </button>
            <button
              onClick={() => setActiveRole("admin")}
              className={`flex-1 pb-4 text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 border-b-2 ${
                activeRole === "admin"
                  ? "border-[#EF9F27] text-[#EF9F27]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Dynamic Label based on role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {activeRole} Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder={`name@${activeRole}.university.edu`}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF9F27] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                <span>Password</span>
                
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF9F27] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider uppercase py-3.5 transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Subtle note */}
          <p className="mt-8 text-center text-xs text-slate-400">
            Secure login for authorized university personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
