"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetProfile } from "@/features/users/states/action";
import { NavbarComponent } from "@/features/posts/components/NavbarComponent";
import { SidebarComponent } from "@/features/posts/components/SidebarComponent";

interface PostLayoutProps {
  children: React.ReactNode;
}

export function PostLayout({ children }: PostLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/auth/login");
    } else {
      setIsAuthenticated(true);
      if (!profile) {
        dispatch(asyncSetProfile());
      }
    }
  }, [router, dispatch, profile]);

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <main
        data-testid="post-layout-loading"
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100"
        aria-label="Memuat"
      >
        <div className="flex flex-col items-center gap-3">
          <output aria-label="Memverifikasi sesi..." className="block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></output>
          <span className="text-xs text-slate-400">Memverifikasi sesi...</span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <SidebarComponent
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PostLayout;
