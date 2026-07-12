"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/store/useAuthStore";
import { Loader } from "../loader/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { role} = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (role === "guest" || !allowedRoles.includes(role)) {
        router.replace("/");
      }
    }
  }, [isHydrated, role, router, allowedRoles]);

  if (!isHydrated || !allowedRoles.includes(role)) {
    return <Loader />;
  }
  return <>{children}</>;
}
