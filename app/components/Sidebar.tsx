"use client";

import { useState } from "react";
import Link from "next/link";
import "../globals.css";


import { FiMenu, FiHome, FiUsers, FiLogOut, FiKey, FiCalendar, FiFile, FiDollarSign } from "react-icons/fi";
import { LuFactory } from "react-icons/lu";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-[#af8f6f] text-white transition-all duration-300 flex flex-col ${className} ${isOpen ? "w-64" : "w-14"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-primary">
        <h1 className={`text-lg text-white font-bold mb-0 ${isOpen ? "block" : "hidden"}`}>
          Sistem Penggajian 
        </h1>
        <button onClick={toggleSidebar} className="text-white">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Menu Items */}
      <nav className="flex flex-col mt-4 space-y-2">
        <div className="relative group">
          <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
            <FiHome size={24} />
            {isOpen && <span className="ml-3">Dashboard</span>}
          </Link>
          <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Dashboard"}</span>
        </div>

        <div className="relative group">
          <Link href="/data-karyawan" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
            <FiUsers size={24} />
            {isOpen && <span className="ml-3">Data Karyawan</span>}
          </Link>
          <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Data Karyawan"}</span>
      </div>

      <div className="relative group">
        <Link href="/produksi-pabrik" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
          <LuFactory size={24} />
          {isOpen && <span className="ml-3">Produksi Pabrik</span>}
        </Link>
        <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Produksi Pabrik"}</span>
      </div>

      <div className="relative group">
        <Link href="/produksi-harian" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
          <FiCalendar size={24} />
          {isOpen && <span className="ml-3">Produksi Harian</span>}
        </Link>
        <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Produksi Harian"}</span>
      </div>

      <div className="relative group">
        <Link href="/gaji-karyawan" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
          <FiDollarSign size={24} />
          {isOpen && <span className="ml-3">Gaji Karyawan</span>}
        </Link>
        <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Gaji Karyawan"}</span>
      </div>

      <div className="relative group">
        <Link href="/laporan" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
          <FiFile size={24} />
          {isOpen && <span className="ml-3">Laporan</span>}
        </Link>
        <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Laporan"}</span>
      </div>


      <div className="relative group">
        <Link href="/logout" className="flex items-center px-4 py-2 hover:bg-[#C5A880] transition">
          <FiLogOut size={24} />
          {isOpen && <span className="ml-3">Logout</span>}
        </Link>
        <span className={`tooltip ${isOpen ? 'hidden' : 'group-hover:opacity-100'}`}>{!isOpen && "Logout"}</span>
      </div>  

      </nav>
    </div>
  );
};

export default Sidebar;