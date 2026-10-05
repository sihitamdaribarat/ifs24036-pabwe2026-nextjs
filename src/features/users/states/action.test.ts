import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
  asyncSetUsers,
  asyncSetUser,
  asyncSetProfile,
  asyncSetChangeProfile,
  asyncSetChangeProfilePhoto,
  asyncSetChangeProfilePassword,
} from "./action";
import { userApi } from "@/features/users/api/userApi";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/features/users/api/userApi");
vi.mock("@/helpers/toolsHelper");

describe("Users Actions", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Action Creators", () => {
    it("setUsersActionCreator", () => {
      const users = [{ id: 1, name: "U1", email: "u1@d.org", email_verified_at: null, created_at: "", updated_at: "" }];
      expect(setUsersActionCreator(users)).toEqual({
        type: ActionType.SET_USERS,
        payload: { users },
      });
    });

    it("setUserActionCreator", () => {
      const user = { id: 1, name: "U1", email: "u1@d.org", email_verified_at: null, created_at: "", updated_at: "" };
      expect(setUserActionCreator(user)).toEqual({
        type: ActionType.SET_USER,
        payload: { user },
      });
    });

    it("setProfileActionCreator", () => {
      const profile = { id: 1, name: "Me", email: "me@d.org", email_verified_at: null, created_at: "", updated_at: "" };
      expect(setProfileActionCreator(profile)).toEqual({
        type: ActionType.SET_PROFILE,
        payload: { profile },
      });
    });

    it("setIsProfileActionCreator", () => {
      expect(setIsProfileActionCreator(true)).toEqual({
        type: ActionType.SET_IS_PROFILE,
        payload: { isProfile: true },
      });
    });

    it("setIsChangeProfileActionCreator", () => {
      expect(setIsChangeProfileActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE,
        payload: { isChangeProfile: true },
      });
    });

    it("setIsChangeProfilePhotoActionCreator", () => {
      expect(setIsChangeProfilePhotoActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
        payload: { isChangeProfilePhoto: true },
      });
    });

    it("setIsChangeProfilePasswordActionCreator", () => {
      expect(setIsChangeProfilePasswordActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
        payload: { isChangeProfilePassword: true },
      });
    });
  });

  describe("Async Thunks", () => {
    it("asyncSetUsers success and failure", async () => {
      const users = [{ id: 1, name: "User 1", email: "u1@delcom.org", email_verified_at: null, created_at: "", updated_at: "" }];
      vi.mocked(userApi.getUsers).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { users },
      });

      const res = await asyncSetUsers()(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator(users));
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.getUsers).mockRejectedValue(new Error("Fail users"));
      const failRes = await asyncSetUsers()(dispatch as any);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Fail users");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetUser success and failure", async () => {
      const user = { id: 2, name: "User 2", email: "u2@delcom.org", email_verified_at: null, created_at: "", updated_at: "" };
      vi.mocked(userApi.getUserById).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { user },
      });

      const res = await asyncSetUser(2)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setUserActionCreator(user));
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.getUserById).mockRejectedValue(new Error("Fail user"));
      const failRes = await asyncSetUser(2)(dispatch as any);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Fail user");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetProfile success and failure", async () => {
      const user = { id: 3, name: "Profile", email: "p@delcom.org", email_verified_at: null, created_at: "", updated_at: "" };
      vi.mocked(userApi.getProfile).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { user },
      });

      const res = await asyncSetProfile()(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(user));
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.getProfile).mockRejectedValue(new Error("Fail profile"));
      const failRes = await asyncSetProfile()(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(false));
      expect(failRes.success).toBe(false);
    });

    it("asyncSetChangeProfile success and failure", async () => {
      const user = { id: 3, name: "Updated Name", email: "p@delcom.org", email_verified_at: null, created_at: "", updated_at: "" };
      vi.mocked(userApi.putProfile).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { user },
      });

      const res = await asyncSetChangeProfile({
        name: "Updated Name",
        email: "p@delcom.org",
      })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(user));
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfileActionCreator(true)
      );
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.putProfile).mockRejectedValue(new Error("Fail edit"));
      const failRes = await asyncSetChangeProfile({
        name: "",
        email: "",
      })(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfileActionCreator(false)
      );
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Fail edit");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetChangeProfilePhoto success and failure", async () => {
      const user = { id: 3, name: "Me", email: "p@delcom.org", photo: "photo.jpg", email_verified_at: null, created_at: "", updated_at: "" };
      vi.mocked(userApi.postProfilePhoto).mockResolvedValue({
        status: "success",
        message: "OK",
        data: { user },
      });

      const formData = new FormData();
      const res = await asyncSetChangeProfilePhoto(formData)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(user));
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfilePhotoActionCreator(true)
      );
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.postProfilePhoto).mockRejectedValue(new Error("Photo fail"));
      const failRes = await asyncSetChangeProfilePhoto(formData)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfilePhotoActionCreator(false)
      );
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Photo fail");
      expect(failRes.success).toBe(false);
    });

    it("asyncSetChangeProfilePassword success and failure", async () => {
      vi.mocked(userApi.putPassword).mockResolvedValue({
        status: "success",
        message: "OK",
      });

      const payload = {
        password: "old",
        new_password: "new",
        new_password_confirmation: "new",
      };
      const res = await asyncSetChangeProfilePassword(payload)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfilePasswordActionCreator(true)
      );
      expect(res.success).toBe(true);

      // Failure
      vi.mocked(userApi.putPassword).mockRejectedValue(new Error("Password fail"));
      const failRes = await asyncSetChangeProfilePassword(payload)(dispatch as any);
      expect(dispatch).toHaveBeenCalledWith(
        setIsChangeProfilePasswordActionCreator(false)
      );
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Password fail");
      expect(failRes.success).toBe(false);
    });
  });
});
