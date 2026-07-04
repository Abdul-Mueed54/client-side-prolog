import SecondarySidebar from "@/components/layouts/secondarySidebar";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";

export default function Faculty() {
  return (
    <>
      <ProtectedRoute allowedRoles={["faculty", "admin"]}>
        <></>
      </ProtectedRoute>
    </>
  );
}
