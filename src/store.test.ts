import { describe, it, expect } from "vitest";
import { store } from "./store";
import { setIsAuthLoginActionCreator } from "@/features/auth/states/action";
import { setUsersActionCreator } from "@/features/users/states/action";
import { setPostsActionCreator } from "@/features/posts/states/action";

describe("Redux Store", () => {
  it("should initialize store with all required state keys", () => {
    const state = store.getState();

    // Auth keys
    expect(state).toHaveProperty("isAuthLogin", false);
    expect(state).toHaveProperty("isAuthRegister", false);
    expect(state).toHaveProperty("isAuthLogout", false);

    // Users keys
    expect(state).toHaveProperty("users", []);
    expect(state).toHaveProperty("user", null);
    expect(state).toHaveProperty("profile", null);
    expect(state).toHaveProperty("isProfile", false);
    expect(state).toHaveProperty("isChangeProfile", false);
    expect(state).toHaveProperty("isChangeProfilePhoto", false);
    expect(state).toHaveProperty("isChangeProfilePassword", false);

    // Posts keys
    expect(state).toHaveProperty("posts", []);
    expect(state).toHaveProperty("post", null);
    expect(state).toHaveProperty("isPost", false);
    expect(state).toHaveProperty("isPostAdd", false);
    expect(state).toHaveProperty("isPostAdded", false);
    expect(state).toHaveProperty("isPostChange", false);
    expect(state).toHaveProperty("isPostChanged", false);
    expect(state).toHaveProperty("isPostChangeCover", false);
    expect(state).toHaveProperty("isPostChangedCover", false);
    expect(state).toHaveProperty("isPostDelete", false);
    expect(state).toHaveProperty("isPostDeleted", false);
    expect(state).toHaveProperty("isPostLike", false);
    expect(state).toHaveProperty("isPostLiked", false);
    expect(state).toHaveProperty("isPostAddComment", false);
    expect(state).toHaveProperty("isPostAddedComment", false);
    expect(state).toHaveProperty("isPostDeleteComment", false);
    expect(state).toHaveProperty("isPostDeletedComment", false);
    expect(state).toHaveProperty("isPostDeleteAll", false);
    expect(state).toHaveProperty("isPostDeletedAll", false);
  });

  it("should handle dispatched actions and update state across feature slices", () => {
    store.dispatch(setIsAuthLoginActionCreator(true));
    expect(store.getState().isAuthLogin).toBe(true);

    const mockUsers = [
      {
        id: 1,
        name: "Test User",
        email: "test@delcom.org",
        email_verified_at: null,
        created_at: "",
        updated_at: "",
      },
    ];
    store.dispatch(setUsersActionCreator(mockUsers));
    expect(store.getState().users).toEqual(mockUsers);

    const mockPosts = [
      {
        id: 1,
        user_id: 1,
        cover: null,
        description: "Test Post",
        created_at: "",
        updated_at: "",
        author: { name: "Test User", photo: null },
        likes: [],
        comments: [],
      },
    ];
    store.dispatch(setPostsActionCreator(mockPosts));
    expect(store.getState().posts).toEqual(mockPosts);
  });
});
