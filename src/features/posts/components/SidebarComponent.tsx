"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  IconArticle,
  IconBookmark,
  IconUsers,
  IconUser,
  IconX,
} from "@tabler/icons-react";

interface SidebarComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarComponent({ isOpen, onClose }: SidebarComponentProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Semua Postingan",
      href: "/",
      icon: IconArticle,
      active: pathname === "/",
    },
    {
      label: "Postingan Saya",
      href: "/?tab=my_posts",
      icon: IconBookmark,
      active: false,
    },
    {
      label: "Daftar Pengguna",
      href: "/users",
      icon: IconUsers,
      active: pathname === "/users",
    },
    {
      label: "Profil Saya",
      href: "/profile",
      icon: IconUser,
      active: pathname === "/profile",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <span className="font-bold text-base text-white">Menu Navigasi</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Tutup Menu"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    item.active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <footer className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-medium text-slate-400">Delcom Open API</p>
          <p className="mt-0.5">&copy; 2026 Gideon Panjaitan</p>
        </footer>
      </aside>
    </>
  );
}

export default SidebarComponent;
