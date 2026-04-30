"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true; // Guest route
    if (path !== "/" && pathname.startsWith(path)) return true; // Protected routes
    return false;
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#ffffff] border-b border-black shrink-0">
      {/* LEFT: Branding */}
      <div className="flex items-center">
        <h1 className="text-2xl font-serif text-gray-900">
          ProLog - Project Cataloging System
        </h1>
      </div>

      {/* RIGHT: Role Navigation Pills */}
      <nav className="flex items-center gap-3">
        <RoleLink
          href="/protected/admin/"
          label="Admin"
          active={isActive("/protected/admin")}
        />
        <RoleLink
          href="/protected/faculty"
          label="Faculty"
          active={isActive("/protected/faculty")
          }
        />
        <RoleLink
          href="/protected/staff"
          label="Staff"
          active={isActive("/protected/staff")}
        />
        <RoleLink href="/" label="Guest" active={isActive("/")} />
      </nav>
    </header>
  );
}

// Reusable Sub-component for the Pill Buttons
function RoleLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors border border-black ${
        active
          ? "bg-[#EF9F27] text-[#412402] " // The amber active state
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" // Inactive state
      }`}
    >
      {label}
    </Link>
  );
}
