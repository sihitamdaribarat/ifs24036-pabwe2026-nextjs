"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetAuthLogout } from "@/features/auth/states/action";
import { showConfirmDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import {
  IconMenu2,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconArticle,
} from "@tabler/icons-react";

interface NavbarComponentProps {
  onToggleSidebar?: () => void;
}

export function NavbarComponent({ onToggleSidebar }: NavbarComponentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = await showConfirmDialog(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari aplikasi?"
    );

    if (confirmed) {
      await dispatch(asyncSetAuthLogout());
      await showSuccessDialog("Berhasil", "Anda telah keluar dari aplikasi");
      router.push("/auth/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <IconMenu2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <IconArticle className="w-5 h-5" />
          </div>
          <span className="font-bold text-base text-white hidden sm:inline">
            Delcom Posts
          </span>
        </div>
      </div>

      {/* User profile dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-label="User Menu"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800 transition text-left"
        >
          {profile?.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white leading-tight">
              {profile?.name || "Pengguna"}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {profile?.email || "user@delcom.org"}
            </p>
          </div>

          <IconChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-slate-700/60 md:hidden">
              <p className="text-sm font-medium text-white">{profile?.name}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
            </div>

            <a
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition"
            >
              <IconUser className="w-4 h-4 text-slate-400" />
              <span>Profil Saya</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
            >
              <IconLogout className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavbarComponent;
