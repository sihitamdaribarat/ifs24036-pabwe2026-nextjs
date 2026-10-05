"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetProfile,
  asyncSetChangeProfile,
  asyncSetChangeProfilePhoto,
  asyncSetChangeProfilePassword,
} from "@/features/users/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import {
  IconUser,
  IconMail,
  IconLock,
  IconCamera,
  IconCheck,
} from "@tabler/icons-react";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  // Profile info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(asyncSetProfile());
    } else {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [dispatch, profile]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      await showErrorDialog("Validasi Gagal", "Nama dan email wajib diisi");
      return;
    }

    setLoadingProfile(true);
    const result = await dispatch(
      asyncSetChangeProfile({
        name: name.trim(),
        email: email.trim(),
      })
    );
    setLoadingProfile(false);

    if (result && result.success) {
      await showSuccessDialog("Berhasil", "Profil berhasil diperbarui");
    }
  };

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handlePhotoUpload = async () => {
    /* v8 ignore next */
    if (!photoFile) return;
    const formData = new FormData();
    formData.append("photo", photoFile);

    setLoadingPhoto(true);
    const result = await dispatch(asyncSetChangeProfilePhoto(formData));
    setLoadingPhoto(false);

    if (result && result.success) {
      await showSuccessDialog("Berhasil", "Foto profil berhasil diperbarui");
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      await showErrorDialog("Validasi Gagal", "Semua kolom kata sandi wajib diisi");
      return;
    }

    if (newPassword.length < 6) {
      await showErrorDialog(
        "Validasi Gagal",
        "Kata sandi baru minimal harus 6 karakter"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      await showErrorDialog(
        "Validasi Gagal",
        "Konfirmasi kata sandi baru tidak sesuai"
      );
      return;
    }

    setLoadingPassword(true);
    const result = await dispatch(
      asyncSetChangeProfilePassword({
        password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
    );
    setLoadingPassword(false);

    if (result && result.success) {
      await showSuccessDialog(
        "Berhasil",
        "Kata sandi akun Anda berhasil diubah"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Pengaturan Akun & Profil
        </h1>
        <p className="text-sm text-slate-400">
          Kelola informasi identitas, foto profil, dan keamanan akun Anda.
        </p>
      </div>

      {/* Foto Profil Card */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Foto Profil</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {photoPreview || profile?.photo ? (
              <img
                src={photoPreview || (profile?.photo as string)}
                alt={profile?.name || "Profile"}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full cursor-pointer shadow-md transition"
              title="Ganti foto"
            >
              <IconCamera className="w-4 h-4" />
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-base font-medium text-white">
              {profile?.name || "Pengguna Delcom"}
            </h3>
            <p className="text-xs text-slate-400">
              Format yang didukung: JPG, PNG, WEBP. Maksimal ukuran 2MB.
            </p>
            {photoFile && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  disabled={loadingPhoto}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {loadingPhoto ? "Mengunggah..." : "Simpan Foto Baru"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informasi Profil Card */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Informasi Pribadi
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconUser className="w-5 h-5" />
              </div>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconMail className="w-5 h-5" />
              </div>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingProfile}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              <IconCheck className="w-4 h-4" />
              <span>{loadingProfile ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Ubah Password Card */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Ubah Kata Sandi</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconLock className="w-5 h-5" />
              </div>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Kata Sandi Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconLock className="w-5 h-5" />
              </div>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconLock className="w-5 h-5" />
              </div>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingPassword}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              <IconLock className="w-4 h-4" />
              <span>
                {loadingPassword ? "Memperbarui..." : "Ubah Kata Sandi"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
