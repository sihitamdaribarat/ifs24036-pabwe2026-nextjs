"use client";

import React, { useState, FormEvent } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { asyncSetPostAdd } from "@/features/posts/states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconX, IconSend } from "@tabler/icons-react";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddModal({ isOpen, onClose, onSuccess }: AddModalProps) {
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      await showErrorDialog("Validasi Gagal", "Deskripsi postingan tidak boleh kosong");
      return;
    }

    setLoading(true);
    const result = await dispatch(
      asyncSetPostAdd({ description: description.trim() })
    );
    setLoading(false);

    if (result && result.success) {
      await showSuccessDialog("Berhasil", "Postingan baru berhasil diterbitkan!");
      setDescription("");
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Buat Postingan Baru</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="post-description"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Apa yang ingin Anda bagikan hari ini?
            </label>
            <textarea
              id="post-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan pemikiran, cerita, atau ide menarik Anda..."
              className="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <IconSend className="w-4 h-4" />
              <span>{loading ? "Menerbitkan..." : "Publikasikan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
