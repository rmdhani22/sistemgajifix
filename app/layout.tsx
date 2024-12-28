"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isSidebarPage = pathname === '/sidebar';

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Fungsi cleanup untuk menghapus link saat komponen di-unmount
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {!isLoginPage && <Sidebar className="block md:block" />}
          <div className="flex flex-col flex-grow">
            {!isLoginPage && <Navbar />}
            <main className="flex-grow overflow-y-auto h-screen">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
