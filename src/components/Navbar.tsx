"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import ModeToggle from "./toggleMode/ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true; // Guest route
    if (path !== "/" && pathname.startsWith(path)) return true; // Protected routes
    return false;
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-pwhite border-b border-black shrink-0">
      <div className="flex items-center gap-2 drop-shadow-sm">
        <Image
          src="/prolog_logo.png"
          alt="Logo"
          width={30}
          height={30}
          className="object-contain h-auto w-auto"
          priority
        />
        <h1 className="text-2xl font-serif text-gray-d">
          ProLog - Project Cataloging System
        </h1>
      </div>

      {/* RIGHT: Role Navigation Pills */}
      <nav className="flex items-center gap-3">
        <RoleLink href="/admin/" label="Admin" active={isActive("/admin")} />
        <RoleLink
          href="/faculty"
          label="Faculty"
          active={isActive("/faculty")}
        />
        <RoleLink href="/staff" label="Staff" active={isActive("/staff")} />
        <RoleLink href="/guest" label="Guest" active={isActive("/guest")} />
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
      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors border border-black shadow hover:shadow-2xl ${
        active
          ? "bg-brand text-gray-d " // The amber active state
          : "bg-white text-gray-d border-gray-300 hover:bg-gray-50" // Inactive state
      }`}
    >
      {label}
    </Link>
  );
}
