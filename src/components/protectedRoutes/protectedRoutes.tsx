"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { role, token } = useAuthStore();

  // We need this hydration state because Next.js server doesn't have access to localStorage.
  // This prevents UI mismatch errors between server and client.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // 1. If there's no token or they are a guest, send them to login
      if (!token || role === "guest" || !allowedRoles.includes(role)) {
        router.replace("/");
      }
    }
  }, [isHydrated, role, token, router, allowedRoles]);

  // Show a loading state while we check their credentials
  if (!isHydrated || !token || !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF9F27]"></div>
      </div>
    );
  }

  // If they pass all checks, let them see the page!
  return <>{children}</>;
}
