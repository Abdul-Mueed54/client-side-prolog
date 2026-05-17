"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();

    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2.5 px-2.5 py-2 w-[calc(100%-12px)] rounded-md text-[15px] cursor-pointer mx-1.5 transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
    >
      <LogOut className="w-4 h-4" strokeWidth={2} />
      <span>Logout</span>
    </button>
  );
}
