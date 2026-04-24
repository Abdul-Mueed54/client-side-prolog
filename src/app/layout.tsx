// src/app/layout.tsx
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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