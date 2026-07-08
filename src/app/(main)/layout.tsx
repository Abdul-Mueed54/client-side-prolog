import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("", geist.variable)}>
      <Navbar />
      <ScrollArea>
      <main className="h-160">{children}</main>
      </ScrollArea>
    </div>
  );
}
