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
  const { role } = useAuthStore();
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsStoreHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setIsStoreHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (isStoreHydrated) {
      if (role === "guest" || !allowedRoles.includes(role)) {
        router.replace("/");
      }
    }
  }, [isStoreHydrated, role, router, allowedRoles.join(",")]);

  if (!isStoreHydrated) {
    return <Loader />; // or a spinner — don't show Access Denied while still checking
  }

  if (role === "guest" || !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500">
          You do not have permission to view this page or your session has expired.
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-brand text-white rounded hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}