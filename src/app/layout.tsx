// src/app/layout.tsx
import Navbar from "../components/Navbar";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-100 h-screen overflow-hidden flex flex-col">
        {/* Rendered once, shared by everyone */}
        <Navbar />

        {/* The specific page content is injected here */}
        <div className="flex-1 overflow-hidden">
          {children}
          
        </div>
      </body>
    </html>
  );
}
