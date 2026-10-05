import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setPostsActionCreator,
  setPostActionCreator,
  setIsPostActionCreator,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedCoverActionCreator,
  setIsPostDeleteActionCreator,
  setIsPostDeletedActionCreator,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostDeleteAllActionCreator,
  setIsPostDeletedAllActionCreator,
  asyncSetPosts,
  asyncSetPost,
  asyncSetPostAdd,
  asyncSetPostChange,
  asyncSetPostChangeCover,
  asyncSetPostDelete,
  asyncSetPostLike,
  asyncSetPostAddComment,
  asyncSetPostDeleteComment,
  asyncSetPostDeleteAll,
} from "./action";
import { postApi } from "@/features/posts/api/postApi";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/features/posts/api/postApi");
vi.mock("@/helpers/toolsHelper");

describe("Posts Actions", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Action Creators", () => {
    it("should create all post action creators properly", () => {
      expect(setPostsActionCreator([])).toEqual({
        type: ActionType.SET_POSTS,
        payload: { posts: [] },
      });
      expect(setPostActionCreator(null)).toEqual({
        type: ActionType.SET_POST,
        payload: { post: null },
      });
      expect(setIsPostActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST,
        payload: { isPost: true },
      });
      expect(setIsPostAddActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_ADD,
        payload: { isPostAdd: true },
      });
      expect(setIsPostAddedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_ADDED,
        payload: { isPostAdded: true },
      });
      expect(setIsPostChangeActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_CHANGE,
        payload: { isPostChange: true },
      });
      expect(setIsPostChangedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_CHANGED,
        payload: { isPostChanged: true },
      });
      expect(setIsPostChangeCoverActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_CHANGE_COVER,
        payload: { isPostChangeCover: true },
      });
      expect(setIsPostChangedCoverActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_CHANGED_COVER,
        payload: { isPostChangedCover: true },
      });
      expect(setIsPostDeleteActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETE,
        payload: { isPostDelete: true },
      });
      expect(setIsPostDeletedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETED,
        payload: { isPostDeleted: true },
      });
      expect(setIsPostLikeActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_LIKE,
        payload: { isPostLike: true },
      });
      expect(setIsPostLikedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_LIKED,
        payload: { isPostLiked: true },
      });
      expect(setIsPostAddCommentActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_ADD_COMMENT,
        payload: { isPostAddComment: true },
      });
      expect(setIsPostAddedCommentActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_ADDED_COMMENT,
        payload: { isPostAddedComment: true },
      });
      expect(setIsPostDeleteCommentActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETE_COMMENT,
        payload: { isPostDeleteComment: true },
      });
      expect(setIsPostDeletedCommentActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETED_COMMENT,
        payload: { isPostDeletedComment: true },
      });
      expect(setIsPostDeleteAllActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETE_ALL,
        payload: { isPostDeleteAll: true },
      });
      expect(setIsPostDeletedAllActionCreator(true)).toEqual({
        type: ActionType.SET_IS_POST_DELETED_ALL,
        payload: { isPostDeletedAll: true },
      });
    });
  });

  describe("Async Thunks", () => {
    it("asyncSetPosts success & failure", async () => {
      vi.mocked(postApi.getPosts).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { posts: [] },
      });
      const res = await asyncSetPosts(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([]));
      expect(res.success).toBe(true);

      vi.mocked(postApi.getPosts).mockRejectedValue(new Error("Posts error"));
      const failRes = await asyncSetPosts()(dispatch as any);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Posts error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPost detail success & failure", async () => {
      const mockPost = {
        id: 1,
        user_id: 1,
        cover: null,
        description: "Post",
        created_at: "",
        updated_at: "",
        author: { name: "Author", photo: null },
        likes: [],
        comments: [],
      };
      vi.mocked(postApi.getPostDetail).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { post: mockPost },
      });
      const res = await asyncSetPost(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(mockPost));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.getPostDetail).mockRejectedValue(new Error("Detail error"));
      const failRes = await asyncSetPost(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Detail error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostAdd success & failure", async () => {
      vi.mocked(postApi.postPost).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { post_id: 10 },
      });
      const res = await asyncSetPostAdd({ description: "New" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.postPost).mockRejectedValue(new Error("Add error"));
      const failRes = await asyncSetPostAdd({ description: "New" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Add error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostChange success & failure", async () => {
      vi.mocked(postApi.putPost).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostChange({ id: 1, description: "Edit" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.putPost).mockRejectedValue(new Error("Change error"));
      const failRes = await asyncSetPostChange({ id: 1, description: "Edit" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Change error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostChangeCover success & failure", async () => {
      vi.mocked(postApi.postCover).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const formData = new FormData();
      const res = await asyncSetPostChangeCover({ id: 1, cover: formData })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.postCover).mockRejectedValue(new Error("Cover error"));
      const failRes = await asyncSetPostChangeCover({ id: 1, cover: formData })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Cover error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostDelete success & failure", async () => {
      vi.mocked(postApi.deletePost).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostDelete(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.deletePost).mockRejectedValue(new Error("Delete error"));
      const failRes = await asyncSetPostDelete(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Delete error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostLike success & failure", async () => {
      vi.mocked(postApi.postLike).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostLike({ id: 1, like: 1 })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.postLike).mockRejectedValue(new Error("Like error"));
      const failRes = await asyncSetPostLike({ id: 1, like: 1 })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Like error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostAddComment success & failure", async () => {
      vi.mocked(postApi.postComment).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostAddComment({ id: 1, comment: "Hello" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.postComment).mockRejectedValue(new Error("Comment error"));
      const failRes = await asyncSetPostAddComment({ id: 1, comment: "Hello" })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Comment error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostDeleteComment success & failure", async () => {
      vi.mocked(postApi.deleteComment).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostDeleteComment(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedCommentActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.deleteComment).mockRejectedValue(new Error("Del comment error"));
      const failRes = await asyncSetPostDeleteComment(1)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedCommentActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Del comment error");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetPostDeleteAll success & failure", async () => {
      vi.mocked(postApi.deleteAllPosts).mockResolvedValue({
        status: "success",
        message: "OK",
      });
      const res = await asyncSetPostDeleteAll()(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(true));
      expect(res.success).toBe(true);

      vi.mocked(postApi.deleteAllPosts).mockRejectedValue(new Error("Del all error"));
      const failRes = await asyncSetPostDeleteAll()(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Del all error");
      expect(failRes.success).toBe(false);
    });
  });
});
