import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
// import { ThemeProvider } from "@/components/toggleMode/ThemeProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      {/* Just the body tag and children! */}
      <body>{children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

// import "./globals.css";
// import { Geist } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { Toaster } from "sonner";
// import ResizableWrapper from "@/components/layouts/resizeable";

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// export const metadata = {
//   title: "ProLog - Project Cataloging System",
//   description: "Browse and manage academic projects.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
//       <body>

//         <ResizableWrapper>
//           {children}
//         </ResizableWrapper>

//         <Toaster richColors position="top-right" />
//       </body>
//     </html>
//   );
// }