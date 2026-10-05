import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { HomePage } from "./HomePage";
import * as postsAction from "@/features/posts/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "tab" ? "all" : null),
  }),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  formatDate: vi.fn(() => "05 Okt 2024"),
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe("HomePage", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@delcom.org",
    photo: null,
    email_verified_at: null,
    created_at: "",
    updated_at: "",
  };

  const mockPosts = [
    {
      id: 1,
      user_id: 1,
      cover: "https://example.com/cover1.jpg",
      description: "Belajar Next.js dan Bun",
      created_at: "2024-10-05T00:00:00Z",
      updated_at: "2024-10-05T00:00:00Z",
      author: { name: "John Doe", photo: null },
      likes: [1],
      comments: [1],
    },
    {
      id: 2,
      user_id: 2,
      cover: null,
      description: "Tips pemrograman web",
      created_at: "2024-10-06T00:00:00Z",
      updated_at: "2024-10-06T00:00:00Z",
      author: { name: "Jane Doe", photo: "https://example.com/jane.jpg" },
      likes: [],
      comments: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render posts list, filter with live search, and navigate to detail", () => {
    vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: mockPosts,
        profile: mockUser,
      },
    });

    expect(screen.getByText("Belajar Next.js dan Bun")).toBeInTheDocument();
    expect(screen.getByText("Tips pemrograman web")).toBeInTheDocument();

    // Live search filter by description
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "Belajar" } });
    expect(screen.getByText("Belajar Next.js dan Bun")).toBeInTheDocument();
    expect(screen.queryByText("Tips pemrograman web")).not.toBeInTheDocument();

    // Live search filter by author name
    fireEvent.change(searchInput, { target: { value: "Jane" } });
    expect(screen.getByText("Tips pemrograman web")).toBeInTheDocument();

    // Click card to navigate to detail
    fireEvent.click(screen.getByText("Tips pemrograman web"));
    expect(mockPush).toHaveBeenCalledWith("/posts/2");
  });

  it("should handle like/unlike button click", async () => {
    vi.spyOn(postsAction, "asyncSetPostLike").mockImplementation(
      () => async () => ({ success: true })
    );
    const setPostsSpy = vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: mockPosts,
        profile: mockUser,
      },
    });

    const likeButtons = screen.getAllByLabelText("Suka Postingan");
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(postsAction.asyncSetPostLike).toHaveBeenCalledWith({
        id: 1,
        like: 0,
      });
      expect(setPostsSpy).toHaveBeenCalled();
    });
  });

  it("should switch tabs to my_posts and back to all, and handle delete all posts", async () => {
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(true);
    vi.spyOn(postsAction, "asyncSetPostDeleteAll").mockImplementation(
      () => async () => ({ success: true })
    );
    const setPostsSpy = vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: mockPosts,
        profile: mockUser,
      },
    });

    // Switch to "Postingan Saya"
    const myPostsTab = screen.getByRole("button", { name: "Postingan Saya" });
    fireEvent.click(myPostsTab);
    expect(setPostsSpy).toHaveBeenCalledWith(1);

    // Switch back to "Semua Postingan"
    const allPostsTab = screen.getByRole("button", { name: "Semua Postingan" });
    fireEvent.click(allPostsTab);
    expect(setPostsSpy).toHaveBeenCalledWith(undefined);

    // Switch to "Postingan Saya" again for deletion
    fireEvent.click(myPostsTab);
    const deleteAllBtn = screen.getByRole("button", { name: /Hapus Semua/i });
    fireEvent.click(deleteAllBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
      expect(postsAction.asyncSetPostDeleteAll).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Semua postingan Anda telah dihapus"
      );
    });
  });

  it("should handle AddModal open, close, and success callbacks", async () => {
    const setPostsSpy = vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );
    vi.spyOn(postsAction, "asyncSetPostAdd").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: { posts: [] },
    });

    const createBtn = screen.getByRole("button", { name: /Buat Postingan/i });
    fireEvent.click(createBtn);

    expect(screen.getByText("Buat Postingan Baru")).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByLabelText("Tutup Modal");
    fireEvent.click(closeBtn);
    expect(screen.queryByText("Buat Postingan Baru")).not.toBeInTheDocument();

    // Open again and publish on "all" tab
    fireEvent.click(createBtn);
    const textarea = screen.getByPlaceholderText(
      /Tuliskan pemikiran, cerita, atau ide menarik Anda.../i
    );
    fireEvent.change(textarea, { target: { value: "Post Baru" } });
    const publishBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(setPostsSpy).toHaveBeenCalledWith(undefined);
    });
  });

  it("should refresh my_posts tab when post is created from my_posts tab", async () => {
    const setPostsSpy = vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );
    vi.spyOn(postsAction, "asyncSetPostAdd").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: [],
        profile: { id: 1, name: "John", email: "john@example.com", photo: null, created_at: "", updated_at: "" },
      },
    });

    // Switch to my_posts
    const myPostsTab = screen.getByRole("button", { name: "Postingan Saya" });
    fireEvent.click(myPostsTab);

    const createBtn = screen.getByRole("button", { name: /Buat Postingan/i });
    fireEvent.click(createBtn);

    const textarea = screen.getByPlaceholderText(
      /Tuliskan pemikiran, cerita, atau ide menarik Anda.../i
    );
    fireEvent.change(textarea, { target: { value: "Post Pribadi Baru" } });
    const publishBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(setPostsSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should render loading spinner when loading and no posts", () => {
    vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => () => new Promise(() => {})
    );

    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { posts: [], profile: mockUser },
    });

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render empty states correctly for search, all tab, and my_posts tab", async () => {
    vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: { posts: [], profile: mockUser },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Belum ada postingan publik yang tersedia saat ini.")
      ).toBeInTheDocument();
    });

    // Switch to my_posts tab
    const myPostsTab = screen.getByRole("button", { name: "Postingan Saya" });
    fireEvent.click(myPostsTab);

    await waitFor(() => {
      expect(
        screen.getByText("Anda belum mempublikasikan postingan apa pun.")
      ).toBeInTheDocument();
    });

    // Search term with no results
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });
    await waitFor(() => {
      expect(
        screen.getByText('Tidak ditemukan postingan yang cocok dengan "xyznonexistent"')
      ).toBeInTheDocument();
    });
  });

  it("should render post cards with null/empty author, non-array likes/comments, and profile null", () => {
    vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    const specialPosts = [
      {
        id: 3,
        user_id: 99,
        cover: null,
        description: "Post with fallback author and non-array likes",
        created_at: "2024-10-07T00:00:00Z",
        updated_at: "2024-10-07T00:00:00Z",
        author: null as any,
        likes: null as any,
        comments: null as any,
      },
      {
        id: 4,
        user_id: 100,
        cover: "https://example.com/cover4.jpg",
        description: "Post with empty author name",
        created_at: "2024-10-08T00:00:00Z",
        updated_at: "2024-10-08T00:00:00Z",
        author: { name: "", photo: null },
        likes: [999],
        comments: [],
      },
    ];

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: specialPosts,
        profile: null,
      },
    });

    expect(screen.getAllByText("Pengguna").length).toBeGreaterThan(0);
    expect(screen.getAllByText("U").length).toBeGreaterThan(0);
  });

  it("should handle like when currently not liked on my_posts tab", async () => {
    const likeSpy = vi.spyOn(postsAction, "asyncSetPostLike").mockImplementation(
      () => async () => ({ success: true })
    );
    const setPostsSpy = vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: mockPosts,
        profile: mockUser,
      },
    });

    const myPostsTab = screen.getByRole("button", { name: "Postingan Saya" });
    fireEvent.click(myPostsTab);

    const likeButtons = screen.getAllByLabelText("Suka Postingan");
    fireEvent.click(likeButtons[1]);

    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith({
        id: 2,
        like: 1,
      });
      expect(setPostsSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should handle delete all when user cancels or when deletion fails", async () => {
    const confirmSpy = vi.mocked(toolsHelper.showConfirmDialog);
    const deleteAllSpy = vi.spyOn(postsAction, "asyncSetPostDeleteAll");
    vi.spyOn(postsAction, "asyncSetPosts").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        posts: mockPosts,
        profile: mockUser,
      },
    });

    const myPostsTab = screen.getByRole("button", { name: "Postingan Saya" });
    fireEvent.click(myPostsTab);

    // Cancel deletion
    confirmSpy.mockResolvedValueOnce(false);
    const deleteAllBtn = screen.getByRole("button", { name: /Hapus Semua/i });
    fireEvent.click(deleteAllBtn);
    expect(deleteAllSpy).not.toHaveBeenCalled();

    // Deletion fails
    confirmSpy.mockResolvedValueOnce(true);
    deleteAllSpy.mockImplementationOnce(() => async () => ({ success: false }));
    fireEvent.click(deleteAllBtn);
    await waitFor(() => {
      expect(deleteAllSpy).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalled();
    });
  });
});

