import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import PrimarySidebar from "@/components/layouts/primarySidebar";
import MainWindow from "@/components/layouts/mainWindow";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-100 h-screen overflow-hidden flex flex-col">
        <div className="flex h-screen overflow-hidden">
          <PrimarySidebar />
          <main className="flex-1 min-w-0 p-4 bg-[#eeeeee]">
            <MainWindow />
          </main>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
