"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { useInput } from "@/hooks/useInput";
import { asyncSetAuthLogin } from "@/features/auth/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconLock, IconMail, IconArrowRight } from "@tabler/icons-react";

export function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      await showErrorDialog(
        "Validasi Gagal",
        "Email dan kata sandi wajib diisi"
      );
      return;
    }

    setLoading(true);
    const result = await dispatch(
      asyncSetAuthLogin({
        email: email.trim(),
        password: password.trim(),
      })
    );
    setLoading(false);

    if (result && result.success) {
      await showSuccessDialog("Berhasil Masuk", "Selamat datang kembali!");
      router.push("/");
    }
  };

  return (
    <section aria-label="Form Login" className="w-full space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Selamat Datang Kembali
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Masuk ke akun Anda untuk mulai menjelajah linimasa postingan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="login-email-input"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconMail className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="login-email-input"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@email.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="login-password-input"
              className="block text-sm font-medium text-slate-300"
            >
              Kata Sandi
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="login-password-input"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          id="login-submit-button"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span>Memproses...</span>
          ) : (
            <>
              <span>Masuk Sekarang</span>
              <IconArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Belum memiliki akun?{" "}
        <a
          href="/auth/register"
          className="font-medium text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
        >
          Daftar akun baru
        </a>
      </div>
    </section>
  );
}

export default LoginPage;
