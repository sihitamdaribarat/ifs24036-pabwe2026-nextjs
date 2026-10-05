"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPosts,
  asyncSetPostLike,
  asyncSetPostDeleteAll,
} from "@/features/posts/states/action";
import { formatDate, showConfirmDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { AddModal } from "@/features/posts/modals/AddModal";
import {
  IconSearch,
  IconPlus,
  IconHeart,
  IconMessageCircle,
  IconCalendar,
  IconTrash,
  IconSparkles,
} from "@tabler/icons-react";

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);
  const profile = useAppSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState<"all" | "my_posts">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isMe = activeTab === "my_posts";
    setLoading(true);
    dispatch(asyncSetPosts(isMe ? 1 : undefined)).finally(() =>
      setLoading(false)
    );
  }, [dispatch, activeTab]);

  const handleTabChange = (tab: "all" | "my_posts") => {
    setActiveTab(tab);
  };

  const handleLike = async (
    e: React.MouseEvent,
    postId: number,
    isLiked: boolean
  ) => {
    e.stopPropagation();
    await dispatch(
      asyncSetPostLike({
        id: postId,
        like: isLiked ? 0 : 1,
      })
    );
    // Refresh posts to reflect updated like count
    dispatch(asyncSetPosts(activeTab === "my_posts" ? 1 : undefined));
  };

  const handleDeleteAll = async () => {
    const confirmed = await showConfirmDialog(
      "Hapus Semua Postingan?",
      "Tindakan ini akan menghapus seluruh postingan milik Anda secara permanen!"
    );

    if (confirmed) {
      const result = await dispatch(asyncSetPostDeleteAll());
      if (result && result.success) {
        await showSuccessDialog(
          "Berhasil",
          "Semua postingan Anda telah dihapus"
        );
        dispatch(asyncSetPosts(1));
      }
    }
  };

  const filteredPosts = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    const descMatch = p.description.toLowerCase().includes(term);
    const authorMatch = p.author?.name?.toLowerCase().includes(term);
    return descMatch || authorMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Linimasa Postingan
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Jelajahi dan berinteraksi dengan cerita dari seluruh pengguna.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "my_posts" && posts.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-semibold transition"
            >
              <IconTrash className="w-4 h-4" />
              <span>Hapus Semua</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <IconPlus className="w-4 h-4" />
            <span>Buat Postingan</span>
          </button>
        </div>
      </div>

      {/* Tabs and Live Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Semua Postingan
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("my_posts")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === "my_posts"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Postingan Saya
          </button>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            role="searchbox"
            placeholder="Cari konten atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Post Grid / List */}
      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <IconSparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Tidak ada postingan</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `Tidak ditemukan postingan yang cocok dengan "${searchTerm}"`
              : activeTab === "my_posts"
              ? "Anda belum mempublikasikan postingan apa pun."
              : "Belum ada postingan publik yang tersedia saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isLiked =
              profile && Array.isArray(post.likes)
                ? post.likes.includes(profile.id)
                : false;
            const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
            const commentsCount = Array.isArray(post.comments)
              ? post.comments.length
              : 0;

            return (
              <div
                key={post.id}
                onClick={() => router.push(`/posts/${post.id}`)}
                className="group bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image if available */}
                  {post.cover && (
                    <div className="w-full h-48 overflow-hidden bg-slate-800 relative">
                      <img
                        src={post.cover}
                        alt="Cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="p-5 space-y-4">
                    {/* Author Information */}
                    <div className="flex items-center gap-3">
                      {post.author?.photo ? (
                        <img
                          src={post.author.photo}
                          alt={post.author.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {post.author?.name
                            ? post.author.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">
                          {post.author?.name || "Pengguna"}
                        </p>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <IconCalendar className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Footer Interactions */}
                <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, post.id, isLiked)}
                      className={`flex items-center gap-1.5 transition ${
                        isLiked
                          ? "text-red-500 hover:text-red-400 font-bold"
                          : "hover:text-red-400"
                      }`}
                      aria-label="Suka Postingan"
                    >
                      <IconHeart
                        className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`}
                      />
                      <span>{likesCount}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <IconMessageCircle className="w-4 h-4" />
                      <span>{commentsCount}</span>
                    </div>
                  </div>

                  <span className="text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold transition">
                    Lihat Detail &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          dispatch(asyncSetPosts(activeTab === "my_posts" ? 1 : undefined));
        }}
      />
    </div>
  );
}

export default HomePage;
