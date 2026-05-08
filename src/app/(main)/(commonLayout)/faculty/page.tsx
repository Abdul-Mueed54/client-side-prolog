import SecondarySidebar from "@/components/layouts/secondarySidebar";
import ProtectedRoute from "@/components/protectedRoutes/protectedRoutes";

export default function Fuest() {
  return (
    <>
      <ProtectedRoute allowedRoles={["faculty", "admin"]}>
        <SecondarySidebar />
      </ProtectedRoute>
    </>
  );
}
