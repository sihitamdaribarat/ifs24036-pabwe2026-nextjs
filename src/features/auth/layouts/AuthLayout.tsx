"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
import { IconArticle, IconSparkles } from "@tabler/icons-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <main
        data-testid="auth-loading"
        className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"
        aria-label="Memuat"
      >
        <output aria-label="Memuat..." className="block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></output>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Visual Banner */}
      <aside
        aria-label="Informasi Aplikasi"
        className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 border-b lg:border-b-0 lg:border-r border-slate-800"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <IconArticle className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-white">
              Delcom Posts
            </p>
            <p className="text-xs text-indigo-300 font-medium">
              Community Platform
            </p>
          </div>
        </div>

        <div className="relative z-10 my-12 lg:my-0 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <IconSparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PABWE 2026 Next.js Application</span>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Bagikan Pemikiran dan Terhubung dengan Komunitas
          </p>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Platform modern untuk berbagi ide, menyukai konten inspiratif, dan
            berdiskusi bersama ribuan anggota aktif Delcom.
          </p>
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Delcom Open API Platform. All
          rights reserved.
        </p>
      </aside>

      {/* Auth Content Card */}
      <main className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
