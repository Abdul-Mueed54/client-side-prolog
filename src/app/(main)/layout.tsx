import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonitorSmartphone } from "lucide-react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* MOBILE BLOCKER: Shows strictly on screens smaller than 'lg' (1024px) */}
      <div className="flex flex-col items-center justify-center h-screen w-full p-8 text-center bg-slate-50 lg:hidden">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 text-brand rounded-full flex items-center justify-center mb-2">
            <MonitorSmartphone className="w-6 h-6 text-brand" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Desktop Recommended
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            This application is optimized for larger screens to handle complex
            data tables and filters. Please open it on a tablet or desktop
            computer for the best experience.
          </p>
        </div>
      </div>

      {/* MAIN APP: Hidden on mobile, shows on 'lg' and up */}
      <div className={cn("hidden lg:flex flex-col", geist.variable)}>
        <Navbar />
        <ScrollArea>
          <main className="h-160">{children}</main>
        </ScrollArea>
      </div>
    </>
  );
}
