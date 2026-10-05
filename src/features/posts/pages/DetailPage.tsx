"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPost,
  asyncSetPostLike,
  asyncSetPostDelete,
  asyncSetPostAddComment,
  asyncSetPostDeleteComment,
} from "@/features/posts/states/action";
import {
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "@/helpers/toolsHelper";
import { ChangeModal } from "@/features/posts/modals/ChangeModal";
import { ChangeCoverModal } from "@/features/posts/modals/ChangeCoverModal";
import {
  IconArrowLeft,
  IconCalendar,
  IconHeart,
  IconEdit,
  IconPhoto,
  IconTrash,
  IconSend,
  IconMessageCircle,
} from "@tabler/icons-react";

interface DetailPageProps {
  postId: number;
}

export function DetailPage({ postId }: DetailPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.post);
  const profile = useAppSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(asyncSetPost(postId)).finally(() => setLoading(false));
  }, [dispatch, postId]);

  const isOwner = profile && post && post.user_id === profile.id;
  const isLiked =
    profile && post && Array.isArray(post.likes)
      ? post.likes.includes(profile.id)
      : false;
  const likesCount = post && Array.isArray(post.likes) ? post.likes.length : 0;

  const handleLike = async () => {
    await dispatch(
      asyncSetPostLike({
        id: postId,
        like: isLiked ? 0 : 1,
      })
    );
    dispatch(asyncSetPost(postId));
  };

  const handleDeletePost = async () => {
    const confirmed = await showConfirmDialog(
      "Hapus Postingan?",
      "Apakah Anda yakin ingin menghapus postingan ini secara permanen?"
    );

    if (confirmed) {
      const result = await dispatch(asyncSetPostDelete(postId));
      if (result && result.success) {
        await showSuccessDialog("Berhasil", "Postingan telah berhasil dihapus");
        router.push("/");
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      await showErrorDialog("Validasi Gagal", "Komentar tidak boleh kosong");
      return;
    }

    setSendingComment(true);
    const result = await dispatch(
      asyncSetPostAddComment({
        id: postId,
        comment: commentText.trim(),
      })
    );
    setSendingComment(false);

    if (result && result.success) {
      setCommentText("");
      dispatch(asyncSetPost(postId));
    }
  };

  const handleDeleteComment = async () => {
    const confirmed = await showConfirmDialog(
      "Hapus Komentar?",
      "Apakah Anda yakin ingin menghapus komentar Anda?"
    );

    if (confirmed) {
      const result = await dispatch(asyncSetPostDeleteComment(postId));
      if (result && result.success) {
        await showSuccessDialog("Berhasil", "Komentar berhasil dihapus");
        dispatch(asyncSetPost(postId));
      }
    }
  };

  if (loading && !post) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-lg font-bold text-white">Postingan tidak ditemukan</h3>
        <p className="text-sm text-slate-400 mt-2">
          Postingan mungkin telah dihapus atau URL tidak valid.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const rawComments = Array.isArray(post.comments) ? post.comments : [];
  const commentsList = rawComments.filter(
    (c): c is { id: number; comment: string; created_at: string; updated_at: string } =>
      typeof c === "object" && c !== null && "comment" in c
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Back Nav & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group"
        >
          <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Kembali ke Linimasa</span>
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCoverModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
            >
              <IconPhoto className="w-4 h-4 text-indigo-400" />
              <span>Ganti Cover</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
            >
              <IconEdit className="w-4 h-4 text-amber-400" />
              <span>Ubah Post</span>
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              aria-label="Hapus Postingan"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium transition"
            >
              <IconTrash className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Post Card */}
      <article className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Cover */}
        {post.cover && (
          <div className="w-full max-h-96 overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={post.cover}
              alt="Post Cover"
              className="w-full object-cover max-h-96"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Author Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              {post.author?.photo ? (
                <img
                  src={post.author.photo}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-md">
                  {post.author?.name
                    ? post.author.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-white">
                  {post.author?.name || "Pengguna Delcom"}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <IconCalendar className="w-3.5 h-3.5" />
                  <span>Diterbitkan {formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                isLiked
                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <IconHeart
                className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`}
              />
              <span>{likesCount} Suka</span>
            </button>
          </div>

          {/* Description Content */}
          <div className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
            {post.description}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconMessageCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Komentar</h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400 font-medium">
              {rawComments.length}
            </span>
          </div>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tuliskan komentar Anda di sini..."
            className="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sendingComment}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition disabled:opacity-50"
            >
              <IconSend className="w-3.5 h-3.5" />
              <span>{sendingComment ? "Mengirim..." : "Kirim Komentar"}</span>
            </button>
          </div>
        </form>

        {/* User's Own Comment Notice / Delete */}
        {post.my_comment && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide">
                Komentar Anda
              </span>
              <p className="text-sm text-slate-200">
                {post.my_comment.comment}
              </p>
              <span className="text-[10px] text-slate-400 block">
                {formatDate(post.my_comment.created_at)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDeleteComment}
              aria-label="Hapus Komentar"
              className="text-xs text-red-400 hover:text-red-300 font-medium shrink-0 flex items-center gap-1 hover:underline"
            >
              <IconTrash className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-2">
          {commentsList.length === 0 && !post.my_comment ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Belum ada komentar. Jadilah yang pertama memberikan respon!
            </p>
          ) : (
            commentsList.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {c.comment}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(c.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Edit Post Modal */}
      <ChangeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        postId={post.id}
        initialDescription={post.description}
        onSuccess={() => dispatch(asyncSetPost(postId))}
      />

      {/* Change Cover Modal */}
      <ChangeCoverModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        postId={post.id}
        currentCoverUrl={post.cover}
        onSuccess={() => dispatch(asyncSetPost(postId))}
      />
    </div>
  );
}

export default DetailPage;
