import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import React from "react";

export default function Admin() {
  return (
    <div className="h-screen">

    <ProtectedRoute allowedRoles={["admin"]}>
      <h1>Hello </h1>
    </ProtectedRoute>
    </div>
  );
}

