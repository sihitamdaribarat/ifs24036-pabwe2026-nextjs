import { ActionType } from "@/features/posts/states/action";
import { Post } from "@/types";

export function postsReducer(
  state: Post[] = [],
  action: any = {}
): Post[] {
  switch (action.type) {
    case ActionType.SET_POSTS:
      return action.payload.posts;
    default:
      return state;
  }
}

export function postReducer(
  state: Post | null = null,
  action: any = {}
): Post | null {
  switch (action.type) {
    case ActionType.SET_POST:
      return action.payload.post;
    default:
      return state;
  }
}

export function isPostReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST:
      return action.payload.isPost;
    default:
      return state;
  }
}

export function isPostAddReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADD:
      return action.payload.isPostAdd;
    default:
      return state;
  }
}

export function isPostAddedReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADDED:
      return action.payload.isPostAdded;
    default:
      return state;
  }
}

export function isPostChangeReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGE:
      return action.payload.isPostChange;
    default:
      return state;
  }
}

export function isPostChangedReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGED:
      return action.payload.isPostChanged;
    default:
      return state;
  }
}

export function isPostChangeCoverReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGE_COVER:
      return action.payload.isPostChangeCover;
    default:
      return state;
  }
}

export function isPostChangedCoverReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGED_COVER:
      return action.payload.isPostChangedCover;
    default:
      return state;
  }
}

export function isPostDeleteReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETE:
      return action.payload.isPostDelete;
    default:
      return state;
  }
}

export function isPostDeletedReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETED:
      return action.payload.isPostDeleted;
    default:
      return state;
  }
}

export function isPostLikeReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_LIKE:
      return action.payload.isPostLike;
    default:
      return state;
  }
}

export function isPostLikedReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_LIKED:
      return action.payload.isPostLiked;
    default:
      return state;
  }
}

export function isPostAddCommentReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADD_COMMENT:
      return action.payload.isPostAddComment;
    default:
      return state;
  }
}

export function isPostAddedCommentReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADDED_COMMENT:
      return action.payload.isPostAddedComment;
    default:
      return state;
  }
}

export function isPostDeleteCommentReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETE_COMMENT:
      return action.payload.isPostDeleteComment;
    default:
      return state;
  }
}

export function isPostDeletedCommentReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETED_COMMENT:
      return action.payload.isPostDeletedComment;
    default:
      return state;
  }
}

export function isPostDeleteAllReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETE_ALL:
      return action.payload.isPostDeleteAll;
    default:
      return state;
  }
}

export function isPostDeletedAllReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETED_ALL:
      return action.payload.isPostDeletedAll;
    default:
      return state;
  }
}

export const posts = postsReducer;
export const post = postReducer;
export const isPost = isPostReducer;
export const isPostAdd = isPostAddReducer;
export const isPostAdded = isPostAddedReducer;
export const isPostChange = isPostChangeReducer;
export const isPostChanged = isPostChangedReducer;
export const isPostChangeCover = isPostChangeCoverReducer;
export const isPostChangedCover = isPostChangedCoverReducer;
export const isPostDelete = isPostDeleteReducer;
export const isPostDeleted = isPostDeletedReducer;
export const isPostLike = isPostLikeReducer;
export const isPostLiked = isPostLikedReducer;
export const isPostAddComment = isPostAddCommentReducer;
export const isPostAddedComment = isPostAddedCommentReducer;
export const isPostDeleteComment = isPostDeleteCommentReducer;
export const isPostDeletedComment = isPostDeletedCommentReducer;
export const isPostDeleteAll = isPostDeleteAllReducer;
export const isPostDeletedAll = isPostDeletedAllReducer;

