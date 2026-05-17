import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
// import { ThemeProvider } from "@/components/toggleMode/ThemeProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      {/* Just the body tag and children! */}
      <body className="overflow-y-auto">{children}</body>
    </html>
  );
}
