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
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsStoreHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setIsStoreHydrated(true);
      });
      return () => { unsub(); };
    }
  }, []);

  useEffect(() => {
    if (isStoreHydrated) {
      if (role === "guest" || !allowedRoles.includes(role)) {
        router.replace("/");
      }
    }
  }, [isStoreHydrated, role, router]);

  if (!isStoreHydrated || role === "guest" || !allowedRoles.includes(role)) {
    return router.replace("/");
  }
  return <>{children}</>;
}
