"use client";

import React, { useState, ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { asyncSetPostChangeCover } from "@/features/posts/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconX, IconUpload, IconPhoto } from "@tabler/icons-react";

interface ChangeCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  currentCoverUrl?: string | null;
  onSuccess?: () => void;
}

export function ChangeCoverModal({
  isOpen,
  onClose,
  postId,
  currentCoverUrl,
  onSuccess,
}: ChangeCoverModalProps) {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      await showErrorDialog("Validasi Gagal", "Pilih file gambar cover terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("cover", selectedFile);

    setLoading(true);
    const result = await dispatch(
      asyncSetPostChangeCover({ id: postId, cover: formData })
    );
    setLoading(false);

    if (result && result.success) {
      await showSuccessDialog("Berhasil", "Cover postingan berhasil diperbarui!");
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Ganti Cover Postingan</h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup Modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Image Preview Box */}
          <div className="w-full h-48 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center overflow-hidden relative">
            {previewUrl || currentCoverUrl ? (
              <img
                src={previewUrl || (currentCoverUrl as string)}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <IconPhoto className="w-10 h-10 stroke-1" />
                <span className="text-xs">Belum ada cover dipilih</span>
              </div>
            )}
            {previewUrl && (
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600/90 text-white text-[10px] font-semibold">
                Pratinjau Baru
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="cover-file"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Pilih Berkas Gambar Baru
            </label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconUpload className="w-4 h-4" />
              <span>{loading ? "Mengunggah..." : "Unggah Cover"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeCoverModal;
