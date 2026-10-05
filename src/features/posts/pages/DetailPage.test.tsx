import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { DetailPage } from "./DetailPage";
import * as postsAction from "@/features/posts/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  formatDate: vi.fn(() => "05 Okt 2024"),
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe("DetailPage", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@delcom.org",
    photo: null,
    email_verified_at: null,
    created_at: "",
    updated_at: "",
  };

  const mockPostDetail = {
    id: 10,
    user_id: 1,
    cover: "https://example.com/cover.jpg",
    description: "Detail postingan lengkap",
    created_at: "2024-10-05T00:00:00Z",
    updated_at: "2024-10-05T00:00:00Z",
    author: { name: "John Doe", photo: "https://example.com/john.jpg" },
    likes: [1],
    comments: [
      {
        id: 101,
        comment: "Komentar pertama",
        created_at: "2024-10-05T01:00:00Z",
        updated_at: "2024-10-05T01:00:00Z",
      },
    ],
    my_comment: {
      id: 102,
      comment: "Komentar saya sendiri",
      created_at: "2024-10-05T02:00:00Z",
      updated_at: "2024-10-05T02:00:00Z",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(postsAction, "asyncSetPost").mockImplementation(
      () => async () => ({ success: true })
    );
  });

  it("should render not found state if post is null", async () => {
    vi.spyOn(postsAction, "asyncSetPost").mockImplementation(
      () => async (dispatch) => {
        dispatch(postsAction.setPostActionCreator(null));
        return { success: false };
      }
    );

    renderWithProviders(<DetailPage postId={999} />, {
      preloadedState: { post: null },
    });

    await waitFor(() => {
      expect(screen.getByText("Postingan tidak ditemukan")).toBeInTheDocument();
    });

    const backBtn = screen.getByRole("button", { name: "Kembali ke Beranda" });
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should render post detail, comments, and handle like", async () => {
    vi.spyOn(postsAction, "asyncSetPostLike").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: mockPostDetail,
        profile: mockUser,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Detail postingan lengkap")).toBeInTheDocument();
      expect(screen.getByText("Komentar pertama")).toBeInTheDocument();
      expect(screen.getByText("Komentar saya sendiri")).toBeInTheDocument();
    });

    // Like button
    const likeBtn = screen.getByRole("button", { name: /1 Suka/i });
    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostLike).toHaveBeenCalledWith({
        id: 10,
        like: 0,
      });
    });

    // Back button navigation
    const backBtn = screen.getByRole("button", { name: /Kembali ke Linimasa/i });
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should allow post owner to edit, change cover, and delete post", async () => {
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(true);
    vi.spyOn(postsAction, "asyncSetPostDelete").mockImplementation(
      () => async () => ({ success: true })
    );
    vi.spyOn(postsAction, "asyncSetPostChange").mockImplementation(
      () => async () => ({ success: true })
    );
    vi.spyOn(postsAction, "asyncSetPostChangeCover").mockImplementation(
      () => async () => ({ success: true })
    );
    const postSpy = vi.spyOn(postsAction, "asyncSetPost").mockImplementation(
      () => async () => ({ success: true })
    );

    const { container } = renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: mockPostDetail,
        profile: mockUser,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Detail postingan lengkap")).toBeInTheDocument();
    });

    // Open and close cover modal
    const coverBtn = screen.getByRole("button", { name: /Ganti Cover/i });
    fireEvent.click(coverBtn);
    expect(screen.getByText("Ganti Cover Postingan")).toBeInTheDocument();
    const cancelCoverBtn = screen.getByRole("button", { name: /Batal/i });
    fireEvent.click(cancelCoverBtn);

    // Open and upload in change cover modal
    fireEvent.click(coverBtn);
    expect(screen.getByText("Ganti Cover Postingan")).toBeInTheDocument();

    const fileInput = container.querySelector("#cover-file") as HTMLInputElement;
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadCoverBtn = screen.getByRole("button", { name: /Unggah Cover/i });
    fireEvent.click(uploadCoverBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChangeCover).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalledWith(10);
    });

    // Open and close change description modal
    const editBtn = screen.getByRole("button", { name: /Ubah Post/i });
    fireEvent.click(editBtn);
    expect(screen.getByText("Edit Deskripsi Postingan")).toBeInTheDocument();
    const closeEditBtn = screen.getByLabelText("Tutup Modal");
    fireEvent.click(closeEditBtn);

    // Open and submit change description modal
    fireEvent.click(editBtn);
    const saveEditBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(saveEditBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChange).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalledWith(10);
    });

    // Delete post
    const deleteBtn = screen.getByLabelText("Hapus Postingan");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
      expect(postsAction.asyncSetPostDelete).toHaveBeenCalledWith(10);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Postingan telah berhasil dihapus"
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should handle adding comments with validation and deleting comments", async () => {
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(true);
    vi.spyOn(postsAction, "asyncSetPostAddComment").mockImplementation(
      () => async () => ({ success: true })
    );
    vi.spyOn(postsAction, "asyncSetPostDeleteComment").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: mockPostDetail,
        profile: mockUser,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Detail postingan lengkap")).toBeInTheDocument();
    });

    const sendBtn = screen.getByRole("button", { name: /Kirim Komentar/i });

    // Validate empty comment
    fireEvent.click(sendBtn);
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Komentar tidak boleh kosong"
      );
    });

    // Add comment with content
    const commentInput = screen.getByPlaceholderText(
      /Tuliskan komentar Anda di sini.../i
    );
    fireEvent.change(commentInput, { target: { value: "Komentar baru" } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostAddComment).toHaveBeenCalledWith({
        id: 10,
        comment: "Komentar baru",
      });
    });

    // Delete user comment
    const deleteCommentBtn = screen.getByLabelText("Hapus Komentar");
    fireEvent.click(deleteCommentBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
      expect(postsAction.asyncSetPostDeleteComment).toHaveBeenCalledWith(10);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Komentar berhasil dihapus"
      );
    });
  });

  it("should render fallback when cover and author photo are null, and when comments are empty", () => {
    const postNoCover = {
      ...mockPostDetail,
      cover: null,
      author: { name: "No Photo Author", photo: null },
      comments: [123], // numeric ID comment
      my_comment: null,
    };

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: postNoCover,
        profile: mockUser,
      },
    });

    expect(
      screen.getByText("Belum ada komentar. Jadilah yang pertama memberikan respon!")
    ).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("should render loading spinner when loading and no post", () => {
    vi.spyOn(postsAction, "asyncSetPost").mockImplementation(
      () => () => new Promise(() => {})
    );

    const { container } = renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: { post: null },
    });

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should handle liking a post that is currently not liked, and hide owner actions for non-owner", async () => {
    const likeSpy = vi.spyOn(postsAction, "asyncSetPostLike").mockImplementation(
      () => async () => ({ success: true })
    );

    const notLikedPost = {
      ...mockPostDetail,
      user_id: 99, // non-owner
      likes: [],
      comments: null as any,
    };

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: notLikedPost,
        profile: mockUser,
      },
    });

    // Owner actions should not be present
    expect(screen.queryByRole("button", { name: /Ubah Post/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ganti Cover/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Hapus Postingan")).not.toBeInTheDocument();

    // Like button should trigger with like = 1
    const likeBtn = screen.getByRole("button", { name: /0 Suka/i });
    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith({
        id: 10,
        like: 1,
      });
    });
  });

  it("should handle cancellation and API failure on post and comment deletion and comment add", async () => {
    const confirmSpy = vi.mocked(toolsHelper.showConfirmDialog);
    const deletePostSpy = vi.spyOn(postsAction, "asyncSetPostDelete");
    const deleteCommentSpy = vi.spyOn(postsAction, "asyncSetPostDeleteComment");
    const addCommentSpy = vi.spyOn(postsAction, "asyncSetPostAddComment");

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: mockPostDetail,
        profile: mockUser,
      },
    });

    // Cancel delete post
    confirmSpy.mockResolvedValueOnce(false);
    const deletePostBtn = screen.getByLabelText("Hapus Postingan");
    fireEvent.click(deletePostBtn);
    expect(deletePostSpy).not.toHaveBeenCalled();

    // Failed delete post
    confirmSpy.mockResolvedValueOnce(true);
    deletePostSpy.mockImplementationOnce(() => async () => ({ success: false }));
    fireEvent.click(deletePostBtn);
    await waitFor(() => {
      expect(deletePostSpy).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalledWith("/");
    });

    // Cancel delete comment
    confirmSpy.mockResolvedValueOnce(false);
    const deleteCommentBtn = screen.getByLabelText("Hapus Komentar");
    fireEvent.click(deleteCommentBtn);
    expect(deleteCommentSpy).not.toHaveBeenCalled();

    // Failed delete comment
    confirmSpy.mockResolvedValueOnce(true);
    deleteCommentSpy.mockImplementationOnce(() => async () => ({ success: false }));
    fireEvent.click(deleteCommentBtn);
    await waitFor(() => {
      expect(deleteCommentSpy).toHaveBeenCalled();
    });

    // Failed add comment
    addCommentSpy.mockImplementationOnce(() => async () => ({ success: false }));
    const commentInput = screen.getByPlaceholderText(
      /Tuliskan komentar Anda di sini.../i
    );
    fireEvent.change(commentInput, { target: { value: "Komentar gagal" } });
    const sendBtn = screen.getByRole("button", { name: /Kirim Komentar/i });
    fireEvent.click(sendBtn);
    await waitFor(() => {
      expect(addCommentSpy).toHaveBeenCalled();
    });
  });

  it("should render fallbacks when author is null or empty and likes is not array", () => {
    const anonymousPost = {
      ...mockPostDetail,
      author: null as any,
      likes: null as any,
      comments: [
        null,
        "string comment",
        { id: 1 },
        { id: 2, comment: "Valid comment text", created_at: "", updated_at: "" },
      ] as any,
      my_comment: null,
    };

    renderWithProviders(<DetailPage postId={10} />, {
      preloadedState: {
        post: anonymousPost,
        profile: null,
      },
    });

    expect(screen.getByText("Pengguna Delcom")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("Valid comment text")).toBeInTheDocument();
  });
});

