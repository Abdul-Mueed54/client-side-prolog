import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";
import React from "react";

function page() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>page</div>
    </ProtectedRoute>
  );
}

export default page;
