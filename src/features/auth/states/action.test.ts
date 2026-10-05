import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
  asyncSetAuthLogin,
  asyncSetAuthRegister,
  asyncSetAuthLogout,
} from "./action";
import { authApi } from "@/features/auth/api/authApi";
import * as apiHelper from "@/helpers/apiHelper";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/features/auth/api/authApi");
vi.mock("@/helpers/apiHelper");
vi.mock("@/helpers/toolsHelper");

describe("Auth Actions", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Action Creators", () => {
    it("should create action to set isAuthLogin", () => {
      const action = setIsAuthLoginActionCreator(true);
      expect(action).toEqual({
        type: ActionType.SET_IS_AUTH_LOGIN,
        payload: { isAuthLogin: true },
      });
    });

    it("should create action to set isAuthRegister", () => {
      const action = setIsAuthRegisterActionCreator(true);
      expect(action).toEqual({
        type: ActionType.SET_IS_AUTH_REGISTER,
        payload: { isAuthRegister: true },
      });
    });

    it("should create action to set isAuthLogout", () => {
      const action = setIsAuthLogoutActionCreator(true);
      expect(action).toEqual({
        type: ActionType.SET_IS_AUTH_LOGOUT,
        payload: { isAuthLogout: true },
      });
    });
  });

  describe("Async Thunks", () => {
    it("asyncSetAuthLogin should handle successful login and store token", async () => {
      vi.mocked(authApi.postLogin).mockResolvedValue({
        status: "success",
        message: "OK",
        data: {
          token: "login-token-123",
          user: { id: 1, name: "Test", email: "test@delcom.org", email_verified_at: null, created_at: "", updated_at: "" },
        },
      });

      const thunk = asyncSetAuthLogin({
        email: "test@delcom.org",
        password: "password123",
      });
      const result = await thunk(dispatch as any);

      expect(authApi.postLogin).toHaveBeenCalled();
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith("login-token-123");
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(true));
      expect(result.success).toBe(true);
    });

    it("asyncSetAuthLogin should handle login failure and show error dialog", async () => {
      vi.mocked(authApi.postLogin).mockRejectedValue(
        new Error("Kredensial salah")
      );

      const thunk = asyncSetAuthLogin({
        email: "wrong@delcom.org",
        password: "wrong",
      });
      const result = await thunk(dispatch as any);

      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(false));
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Kredensial salah"
      );
      expect(result.success).toBe(false);
    });

    it("asyncSetAuthRegister should handle successful registration", async () => {
      vi.mocked(authApi.postRegister).mockResolvedValue({
        status: "success",
        message: "OK",
        data: {},
      });

      const thunk = asyncSetAuthRegister({
        name: "Test User",
        email: "test@delcom.org",
        password: "password123",
      });
      const result = await thunk(dispatch as any);

      expect(authApi.postRegister).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        setIsAuthRegisterActionCreator(true)
      );
      expect(result.success).toBe(true);
    });

    it("asyncSetAuthRegister should handle registration failure", async () => {
      vi.mocked(authApi.postRegister).mockRejectedValue(
        new Error("Email sudah digunakan")
      );

      const thunk = asyncSetAuthRegister({
        name: "Test User",
        email: "test@delcom.org",
        password: "password123",
      });
      const result = await thunk(dispatch as any);

      expect(dispatch).toHaveBeenCalledWith(
        setIsAuthRegisterActionCreator(false)
      );
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Email sudah digunakan"
      );
      expect(result.success).toBe(false);
    });

    it("asyncSetAuthLogout should handle logout and clear token", async () => {
      vi.mocked(authApi.postLogout).mockResolvedValue({
        status: "success",
        message: "OK",
      });

      const thunk = asyncSetAuthLogout();
      const result = await thunk(dispatch as any);

      expect(authApi.postLogout).toHaveBeenCalled();
      expect(apiHelper.removeAccessToken).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        setIsAuthLogoutActionCreator(true)
      );
      expect(result.success).toBe(true);
    });

    it("asyncSetAuthLogout should still clear token even if logout API throws error", async () => {
      vi.mocked(authApi.postLogout).mockRejectedValue(new Error("Network Error"));

      const thunk = asyncSetAuthLogout();
      const result = await thunk(dispatch as any);

      expect(apiHelper.removeAccessToken).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        setIsAuthLogoutActionCreator(true)
      );
      expect(result.success).toBe(true);
    });
  });
});
