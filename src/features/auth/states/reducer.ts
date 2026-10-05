import { ActionType } from "@/features/auth/states/action";

export function isAuthLoginReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGIN:
      return action.payload.isAuthLogin;
    default:
      return state;
  }
}

export function isAuthRegisterReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_REGISTER:
      return action.payload.isAuthRegister;
    default:
      return state;
  }
}

export function isAuthLogoutReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGOUT:
      return action.payload.isAuthLogout;
    default:
      return state;
  }
}

export const isAuthLogin = isAuthLoginReducer;
export const isAuthRegister = isAuthRegisterReducer;
export const isAuthLogout = isAuthLogoutReducer;
