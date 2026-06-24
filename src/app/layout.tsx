import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCMS",
  description: "Multilingual Crisis Management System ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-100 lg:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <Topbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
