import { describe, it, expect } from "vitest";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./reducer";
import {
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
} from "./action";

describe("Users Reducers", () => {
  it("usersReducer handles initial state and SET_USERS", () => {
    expect(usersReducer(undefined, {})).toEqual([]);
    const users = [{ id: 1, name: "U1", email: "u1@d.org", email_verified_at: null, created_at: "", updated_at: "" }];
    expect(usersReducer([], setUsersActionCreator(users))).toEqual(users);
  });

  it("userReducer handles initial state and SET_USER", () => {
    expect(userReducer(undefined, {})).toBeNull();
    const user = { id: 1, name: "U1", email: "u1@d.org", email_verified_at: null, created_at: "", updated_at: "" };
    expect(userReducer(null, setUserActionCreator(user))).toEqual(user);
  });

  it("profileReducer handles initial state and SET_PROFILE", () => {
    expect(profileReducer(undefined, {})).toBeNull();
    const profile = { id: 1, name: "Me", email: "me@d.org", email_verified_at: null, created_at: "", updated_at: "" };
    expect(profileReducer(null, setProfileActionCreator(profile))).toEqual(profile);
  });

  it("isProfileReducer handles initial state and SET_IS_PROFILE", () => {
    expect(isProfileReducer(undefined, {})).toBe(false);
    expect(isProfileReducer(false, setIsProfileActionCreator(true))).toBe(true);
  });

  it("isChangeProfileReducer handles initial state and SET_IS_CHANGE_PROFILE", () => {
    expect(isChangeProfileReducer(undefined, {})).toBe(false);
    expect(isChangeProfileReducer(false, setIsChangeProfileActionCreator(true))).toBe(true);
  });

  it("isChangeProfilePhotoReducer handles initial state and SET_IS_CHANGE_PROFILE_PHOTO", () => {
    expect(isChangeProfilePhotoReducer(undefined, {})).toBe(false);
    expect(isChangeProfilePhotoReducer(false, setIsChangeProfilePhotoActionCreator(true))).toBe(true);
  });

  it("isChangeProfilePasswordReducer handles initial state and SET_IS_CHANGE_PROFILE_PASSWORD", () => {
    expect(isChangeProfilePasswordReducer(undefined, {})).toBe(false);
    expect(isChangeProfilePasswordReducer(false, setIsChangeProfilePasswordActionCreator(true))).toBe(true);
  });
});
