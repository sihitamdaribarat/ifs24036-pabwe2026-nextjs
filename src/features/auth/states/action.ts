import { AppDispatch } from "@/store";
import { authApi } from "@/features/auth/api/authApi";
import { putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import { LoginPayload, RegisterPayload } from "@/types/action";
import { showErrorDialog } from "@/helpers/toolsHelper";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "SET_IS_AUTH_LOGOUT",
} as const;

export function setIsAuthLoginActionCreator(isAuthLogin: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_LOGIN,
    payload: {
      isAuthLogin,
    },
  };
}

export function setIsAuthRegisterActionCreator(isAuthRegister: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_REGISTER,
    payload: {
      isAuthRegister,
    },
  };
}

export function setIsAuthLogoutActionCreator(isAuthLogout: boolean) {
  return {
    type: ActionType.SET_IS_AUTH_LOGOUT,
    payload: {
      isAuthLogout,
    },
  };
}

export function asyncSetAuthLogin(payload: LoginPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await authApi.postLogin(payload);
      putAccessToken(response.data.token);
      dispatch(setIsAuthLoginActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsAuthLoginActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetAuthRegister(payload: RegisterPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await authApi.postRegister(payload);
      dispatch(setIsAuthRegisterActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsAuthRegisterActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetAuthLogout() {
  return async (dispatch: AppDispatch) => {
    try {
      await authApi.postLogout();
    } catch {
      // ignore
    } finally {
      removeAccessToken();
      dispatch(setIsAuthLogoutActionCreator(true));
    }
    return { success: true };
  };
}
