import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPosts,
  getPostDetail,
  postPost,
  putPost,
  postCover,
  deletePost,
  postLike,
  postComment,
  deleteComment,
  deleteAllPosts,
  postApi,
} from "./postApi";
import * as apiHelper from "@/helpers/apiHelper";

vi.mock("@/helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("postApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPosts should fetch all posts or filtered by is_me", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({
      status: "success",
      data: { posts: [] },
    });

    await getPosts();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts", {
      params: undefined,
    });

    await getPosts(1);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts", {
      params: { is_me: 1 },
    });
  });

  it("getPostDetail should fetch GET /posts/:id", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({
      status: "success",
      data: { post: { id: 1 } },
    });

    await getPostDetail(1);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/1");
  });

  it("postPost should POST /posts with description", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await postPost({ description: "Halo dunia" });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts", {
      method: "POST",
      body: JSON.stringify({ description: "Halo dunia" }),
    });
  });

  it("putPost should PUT /posts/:id with description", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await putPost({ id: 2, description: "Deskripsi baru" });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/2", {
      method: "PUT",
      body: JSON.stringify({ description: "Deskripsi baru" }),
    });
  });

  it("postCover should POST /posts/:id/cover with formData", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    const formData = new FormData();
    await postCover(3, formData);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/3/cover", {
      method: "POST",
      body: formData,
    });
  });

  it("deletePost should DELETE /posts/:id", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await deletePost(4);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/4", {
      method: "DELETE",
    });
  });

  it("postLike should POST /posts/:id/likes", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await postLike({ id: 5, like: 1 });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/5/likes", {
      method: "POST",
      body: JSON.stringify({ like: 1 }),
    });
  });

  it("postComment should POST /posts/:id/comments", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await postComment({ id: 6, comment: "Keren!" });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/6/comments", {
      method: "POST",
      body: JSON.stringify({ comment: "Keren!" }),
    });
  });

  it("deleteComment should DELETE /posts/:id/comments", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await deleteComment(7);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts/7/comments", {
      method: "DELETE",
    });
  });

  it("deleteAllPosts should DELETE /posts", async () => {
    vi.mocked(apiHelper.fetchApi).mockResolvedValue({ status: "success" });

    await deleteAllPosts();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/posts", {
      method: "DELETE",
    });
  });

  it("should expose postApi object with all functions", () => {
    expect(postApi.getPosts).toBe(getPosts);
    expect(postApi.getPostDetail).toBe(getPostDetail);
    expect(postApi.postPost).toBe(postPost);
    expect(postApi.putPost).toBe(putPost);
    expect(postApi.postCover).toBe(postCover);
    expect(postApi.deletePost).toBe(deletePost);
    expect(postApi.postLike).toBe(postLike);
    expect(postApi.postComment).toBe(postComment);
    expect(postApi.deleteComment).toBe(deleteComment);
    expect(postApi.deleteAllPosts).toBe(deleteAllPosts);
  });
});
