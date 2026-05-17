import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex flex-col h-screen overflow-hidden", geist.variable)}
    >
      <Navbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
