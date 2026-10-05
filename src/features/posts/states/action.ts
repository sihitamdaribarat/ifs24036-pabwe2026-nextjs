import { AppDispatch } from "@/store";
import { postApi } from "@/features/posts/api/postApi";
import { Post } from "@/types";
import {
  AddCommentPayload,
  AddPostPayload,
  LikePostPayload,
  UpdatePostPayload,
} from "@/types/action";
import { showErrorDialog } from "@/helpers/toolsHelper";

export const ActionType = {
  SET_POSTS: "SET_POSTS",
  SET_POST: "SET_POST",
  SET_IS_POST: "SET_IS_POST",
  SET_IS_POST_ADD: "SET_IS_POST_ADD",
  SET_IS_POST_ADDED: "SET_IS_POST_ADDED",
  SET_IS_POST_CHANGE: "SET_IS_POST_CHANGE",
  SET_IS_POST_CHANGED: "SET_IS_POST_CHANGED",
  SET_IS_POST_CHANGE_COVER: "SET_IS_POST_CHANGE_COVER",
  SET_IS_POST_CHANGED_COVER: "SET_IS_POST_CHANGED_COVER",
  SET_IS_POST_DELETE: "SET_IS_POST_DELETE",
  SET_IS_POST_DELETED: "SET_IS_POST_DELETED",
  SET_IS_POST_LIKE: "SET_IS_POST_LIKE",
  SET_IS_POST_LIKED: "SET_IS_POST_LIKED",
  SET_IS_POST_ADD_COMMENT: "SET_IS_POST_ADD_COMMENT",
  SET_IS_POST_ADDED_COMMENT: "SET_IS_POST_ADDED_COMMENT",
  SET_IS_POST_DELETE_COMMENT: "SET_IS_POST_DELETE_COMMENT",
  SET_IS_POST_DELETED_COMMENT: "SET_IS_POST_DELETED_COMMENT",
  SET_IS_POST_DELETE_ALL: "SET_IS_POST_DELETE_ALL",
  SET_IS_POST_DELETED_ALL: "SET_IS_POST_DELETED_ALL",
} as const;

export function setPostsActionCreator(posts: Post[]) {
  return {
    type: ActionType.SET_POSTS,
    payload: { posts },
  };
}

export function setPostActionCreator(post: Post | null) {
  return {
    type: ActionType.SET_POST,
    payload: { post },
  };
}

export function setIsPostActionCreator(isPost: boolean) {
  return {
    type: ActionType.SET_IS_POST,
    payload: { isPost },
  };
}

export function setIsPostAddActionCreator(isPostAdd: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADD,
    payload: { isPostAdd },
  };
}

export function setIsPostAddedActionCreator(isPostAdded: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADDED,
    payload: { isPostAdded },
  };
}

export function setIsPostChangeActionCreator(isPostChange: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGE,
    payload: { isPostChange },
  };
}

export function setIsPostChangedActionCreator(isPostChanged: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGED,
    payload: { isPostChanged },
  };
}

export function setIsPostChangeCoverActionCreator(isPostChangeCover: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGE_COVER,
    payload: { isPostChangeCover },
  };
}

export function setIsPostChangedCoverActionCreator(
  isPostChangedCover: boolean
) {
  return {
    type: ActionType.SET_IS_POST_CHANGED_COVER,
    payload: { isPostChangedCover },
  };
}

export function setIsPostDeleteActionCreator(isPostDelete: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE,
    payload: { isPostDelete },
  };
}

export function setIsPostDeletedActionCreator(isPostDeleted: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED,
    payload: { isPostDeleted },
  };
}

export function setIsPostLikeActionCreator(isPostLike: boolean) {
  return {
    type: ActionType.SET_IS_POST_LIKE,
    payload: { isPostLike },
  };
}

export function setIsPostLikedActionCreator(isPostLiked: boolean) {
  return {
    type: ActionType.SET_IS_POST_LIKED,
    payload: { isPostLiked },
  };
}

export function setIsPostAddCommentActionCreator(isPostAddComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADD_COMMENT,
    payload: { isPostAddComment },
  };
}

export function setIsPostAddedCommentActionCreator(
  isPostAddedComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_ADDED_COMMENT,
    payload: { isPostAddedComment },
  };
}

export function setIsPostDeleteCommentActionCreator(
  isPostDeleteComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_DELETE_COMMENT,
    payload: { isPostDeleteComment },
  };
}

export function setIsPostDeletedCommentActionCreator(
  isPostDeletedComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_DELETED_COMMENT,
    payload: { isPostDeletedComment },
  };
}

export function setIsPostDeleteAllActionCreator(isPostDeleteAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE_ALL,
    payload: { isPostDeleteAll },
  };
}

export function setIsPostDeletedAllActionCreator(isPostDeletedAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED_ALL,
    payload: { isPostDeletedAll },
  };
}

export function asyncSetPosts(is_me?: number | boolean) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await postApi.getPosts(is_me);
      dispatch(setPostsActionCreator(response.data.posts));
      return { success: true, data: response.data.posts };
    } catch (error: any) {
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetPost(id: number) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostActionCreator(false));
      const response = await postApi.getPostDetail(id);
      dispatch(setPostActionCreator(response.data.post));
      dispatch(setIsPostActionCreator(true));
      return { success: true, data: response.data.post };
    } catch (error: any) {
      dispatch(setIsPostActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetPostAdd(payload: AddPostPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostAddActionCreator(true));
      const response = await postApi.postPost(payload);
      dispatch(setIsPostAddedActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostAddedActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostAddActionCreator(false));
    }
  };
}

export function asyncSetPostChange(payload: UpdatePostPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostChangeActionCreator(true));
      const response = await postApi.putPost(payload);
      dispatch(setIsPostChangedActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostChangedActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostChangeActionCreator(false));
    }
  };
}

export function asyncSetPostChangeCover(payload: {
  id: number;
  cover: FormData;
}) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostChangeCoverActionCreator(true));
      const response = await postApi.postCover(payload.id, payload.cover);
      dispatch(setIsPostChangedCoverActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostChangedCoverActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostChangeCoverActionCreator(false));
    }
  };
}

export function asyncSetPostDelete(id: number) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostDeleteActionCreator(true));
      const response = await postApi.deletePost(id);
      dispatch(setIsPostDeletedActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostDeletedActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostDeleteActionCreator(false));
    }
  };
}

export function asyncSetPostLike(payload: LikePostPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostLikeActionCreator(true));
      const response = await postApi.postLike(payload);
      dispatch(setIsPostLikedActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostLikedActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostLikeActionCreator(false));
    }
  };
}

export function asyncSetPostAddComment(payload: AddCommentPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostAddCommentActionCreator(true));
      const response = await postApi.postComment(payload);
      dispatch(setIsPostAddedCommentActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostAddedCommentActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostAddCommentActionCreator(false));
    }
  };
}

export function asyncSetPostDeleteComment(id: number) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostDeleteCommentActionCreator(true));
      const response = await postApi.deleteComment(id);
      dispatch(setIsPostDeletedCommentActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostDeletedCommentActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostDeleteCommentActionCreator(false));
    }
  };
}

export function asyncSetPostDeleteAll() {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsPostDeleteAllActionCreator(true));
      const response = await postApi.deleteAllPosts();
      dispatch(setIsPostDeletedAllActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsPostDeletedAllActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    } finally {
      dispatch(setIsPostDeleteAllActionCreator(false));
    }
  };
}
