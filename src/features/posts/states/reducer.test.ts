import { describe, it, expect } from "vitest";
import {
  postsReducer,
  postReducer,
  isPostReducer,
  isPostAddReducer,
  isPostAddedReducer,
  isPostChangeReducer,
  isPostChangedReducer,
  isPostChangeCoverReducer,
  isPostChangedCoverReducer,
  isPostDeleteReducer,
  isPostDeletedReducer,
  isPostLikeReducer,
  isPostLikedReducer,
  isPostAddCommentReducer,
  isPostAddedCommentReducer,
  isPostDeleteCommentReducer,
  isPostDeletedCommentReducer,
  isPostDeleteAllReducer,
  isPostDeletedAllReducer,
} from "./reducer";
import {
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
} from "./action";

describe("Posts Reducers", () => {
  it("postsReducer handles default and SET_POSTS", () => {
    expect(postsReducer(undefined, {})).toEqual([]);
    const dummy = [{ id: 1 } as any];
    expect(postsReducer([], setPostsActionCreator(dummy))).toEqual(dummy);
  });

  it("postReducer handles default and SET_POST", () => {
    expect(postReducer(undefined, {})).toBeNull();
    const dummy = { id: 1 } as any;
    expect(postReducer(null, setPostActionCreator(dummy))).toEqual(dummy);
  });

  it("isPostReducer handles default and SET_IS_POST", () => {
    expect(isPostReducer(undefined, {})).toBe(false);
    expect(isPostReducer(false, setIsPostActionCreator(true))).toBe(true);
  });

  it("isPostAddReducer handles default and SET_IS_POST_ADD", () => {
    expect(isPostAddReducer(undefined, {})).toBe(false);
    expect(isPostAddReducer(false, setIsPostAddActionCreator(true))).toBe(true);
  });

  it("isPostAddedReducer handles default and SET_IS_POST_ADDED", () => {
    expect(isPostAddedReducer(undefined, {})).toBe(false);
    expect(isPostAddedReducer(false, setIsPostAddedActionCreator(true))).toBe(true);
  });

  it("isPostChangeReducer handles default and SET_IS_POST_CHANGE", () => {
    expect(isPostChangeReducer(undefined, {})).toBe(false);
    expect(isPostChangeReducer(false, setIsPostChangeActionCreator(true))).toBe(true);
  });

  it("isPostChangedReducer handles default and SET_IS_POST_CHANGED", () => {
    expect(isPostChangedReducer(undefined, {})).toBe(false);
    expect(isPostChangedReducer(false, setIsPostChangedActionCreator(true))).toBe(true);
  });

  it("isPostChangeCoverReducer handles default and SET_IS_POST_CHANGE_COVER", () => {
    expect(isPostChangeCoverReducer(undefined, {})).toBe(false);
    expect(isPostChangeCoverReducer(false, setIsPostChangeCoverActionCreator(true))).toBe(true);
  });

  it("isPostChangedCoverReducer handles default and SET_IS_POST_CHANGED_COVER", () => {
    expect(isPostChangedCoverReducer(undefined, {})).toBe(false);
    expect(isPostChangedCoverReducer(false, setIsPostChangedCoverActionCreator(true))).toBe(true);
  });

  it("isPostDeleteReducer handles default and SET_IS_POST_DELETE", () => {
    expect(isPostDeleteReducer(undefined, {})).toBe(false);
    expect(isPostDeleteReducer(false, setIsPostDeleteActionCreator(true))).toBe(true);
  });

  it("isPostDeletedReducer handles default and SET_IS_POST_DELETED", () => {
    expect(isPostDeletedReducer(undefined, {})).toBe(false);
    expect(isPostDeletedReducer(false, setIsPostDeletedActionCreator(true))).toBe(true);
  });

  it("isPostLikeReducer handles default and SET_IS_POST_LIKE", () => {
    expect(isPostLikeReducer(undefined, {})).toBe(false);
    expect(isPostLikeReducer(false, setIsPostLikeActionCreator(true))).toBe(true);
  });

  it("isPostLikedReducer handles default and SET_IS_POST_LIKED", () => {
    expect(isPostLikedReducer(undefined, {})).toBe(false);
    expect(isPostLikedReducer(false, setIsPostLikedActionCreator(true))).toBe(true);
  });

  it("isPostAddCommentReducer handles default and SET_IS_POST_ADD_COMMENT", () => {
    expect(isPostAddCommentReducer(undefined, {})).toBe(false);
    expect(isPostAddCommentReducer(false, setIsPostAddCommentActionCreator(true))).toBe(true);
  });

  it("isPostAddedCommentReducer handles default and SET_IS_POST_ADDED_COMMENT", () => {
    expect(isPostAddedCommentReducer(undefined, {})).toBe(false);
    expect(isPostAddedCommentReducer(false, setIsPostAddedCommentActionCreator(true))).toBe(true);
  });

  it("isPostDeleteCommentReducer handles default and SET_IS_POST_DELETE_COMMENT", () => {
    expect(isPostDeleteCommentReducer(undefined, {})).toBe(false);
    expect(isPostDeleteCommentReducer(false, setIsPostDeleteCommentActionCreator(true))).toBe(true);
  });

  it("isPostDeletedCommentReducer handles default and SET_IS_POST_DELETED_COMMENT", () => {
    expect(isPostDeletedCommentReducer(undefined, {})).toBe(false);
    expect(isPostDeletedCommentReducer(false, setIsPostDeletedCommentActionCreator(true))).toBe(true);
  });

  it("isPostDeleteAllReducer handles default and SET_IS_POST_DELETE_ALL", () => {
    expect(isPostDeleteAllReducer(undefined, {})).toBe(false);
    expect(isPostDeleteAllReducer(false, setIsPostDeleteAllActionCreator(true))).toBe(true);
  });

  it("isPostDeletedAllReducer handles default and SET_IS_POST_DELETED_ALL", () => {
    expect(isPostDeletedAllReducer(undefined, {})).toBe(false);
    expect(isPostDeletedAllReducer(false, setIsPostDeletedAllActionCreator(true))).toBe(true);
  });
});
