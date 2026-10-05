import { describe, it, expect } from "vitest";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./reducer";
import {
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
} from "./action";

describe("Auth Reducers", () => {
  describe("isAuthLoginReducer", () => {
    it("should return default state when action is undefined or unrelated", () => {
      expect(isAuthLoginReducer(undefined, {})).toBe(false);
      expect(isAuthLoginReducer(true, { type: "UNKNOWN_ACTION" })).toBe(true);
    });

    it("should update isAuthLogin state when SET_IS_AUTH_LOGIN is dispatched", () => {
      const state = isAuthLoginReducer(
        false,
        setIsAuthLoginActionCreator(true)
      );
      expect(state).toBe(true);
    });
  });

  describe("isAuthRegisterReducer", () => {
    it("should return default state when action is undefined or unrelated", () => {
      expect(isAuthRegisterReducer(undefined, {})).toBe(false);
      expect(isAuthRegisterReducer(true, { type: "UNKNOWN_ACTION" })).toBe(true);
    });

    it("should update isAuthRegister state when SET_IS_AUTH_REGISTER is dispatched", () => {
      const state = isAuthRegisterReducer(
        false,
        setIsAuthRegisterActionCreator(true)
      );
      expect(state).toBe(true);
    });
  });

  describe("isAuthLogoutReducer", () => {
    it("should return default state when action is undefined or unrelated", () => {
      expect(isAuthLogoutReducer(undefined, {})).toBe(false);
      expect(isAuthLogoutReducer(true, { type: "UNKNOWN_ACTION" })).toBe(true);
    });

    it("should update isAuthLogout state when SET_IS_AUTH_LOGOUT is dispatched", () => {
      const state = isAuthLogoutReducer(
        false,
        setIsAuthLogoutActionCreator(true)
      );
      expect(state).toBe(true);
    });
  });
});
