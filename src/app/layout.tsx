import type { Metadata } from "next";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
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
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </body>
    </html>
  );
}

