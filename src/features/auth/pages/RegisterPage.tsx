"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { useInput } from "@/hooks/useInput";
import { asyncSetAuthRegister } from "@/features/auth/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconLock, IconMail, IconUser, IconArrowRight } from "@tabler/icons-react";

export function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmPasswordChange] = useInput("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      await showErrorDialog(
        "Validasi Gagal",
        "Nama, email, dan kata sandi wajib diisi"
      );
      return;
    }

    if (password.length < 6) {
      await showErrorDialog(
        "Validasi Gagal",
        "Kata sandi minimal harus 6 karakter"
      );
      return;
    }

    if (password !== confirmPassword) {
      await showErrorDialog(
        "Validasi Gagal",
        "Konfirmasi kata sandi tidak cocok"
      );
      return;
    }

    setLoading(true);
    const result = await dispatch(
      asyncSetAuthRegister({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      })
    );
    setLoading(false);

    if (result && result.success) {
      await showSuccessDialog(
        "Registrasi Berhasil",
        "Akun Anda telah berhasil didaftarkan. Silakan masuk."
      );
      router.push("/auth/login");
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Bergabung bersama komunitas Delcom untuk berbagi cerita dan ide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconUser className="w-5 h-5" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconMail className="w-5 h-5" />
            </div>
            <input
              id="email"
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Minimal 6 karakter"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconLock className="w-5 h-5" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              placeholder="Ulangi kata sandi"
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span>Mendaftarkan...</span>
          ) : (
            <>
              <span>Daftar Akun</span>
              <IconArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Sudah memiliki akun?{" "}
        <a
          href="/auth/login"
          className="font-medium text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
        >
          Masuk di sini
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
