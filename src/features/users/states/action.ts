import { AppDispatch } from "@/store";
import { userApi } from "@/features/users/api/userApi";
import { User } from "@/types";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/types/action";
import { showErrorDialog } from "@/helpers/toolsHelper";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
} as const;

export function setUsersActionCreator(users: User[]) {
  return {
    type: ActionType.SET_USERS,
    payload: {
      users,
    },
  };
}

export function setUserActionCreator(user: User | null) {
  return {
    type: ActionType.SET_USER,
    payload: {
      user,
    },
  };
}

export function setProfileActionCreator(profile: User | null) {
  return {
    type: ActionType.SET_PROFILE,
    payload: {
      profile,
    },
  };
}

export function setIsProfileActionCreator(isProfile: boolean) {
  return {
    type: ActionType.SET_IS_PROFILE,
    payload: {
      isProfile,
    },
  };
}

export function setIsChangeProfileActionCreator(isChangeProfile: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: {
      isChangeProfile,
    },
  };
}

export function setIsChangeProfilePhotoActionCreator(
  isChangeProfilePhoto: boolean
) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: {
      isChangeProfilePhoto,
    },
  };
}

export function setIsChangeProfilePasswordActionCreator(
  isChangeProfilePassword: boolean
) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: {
      isChangeProfilePassword,
    },
  };
}

export function asyncSetUsers() {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await userApi.getUsers();
      dispatch(setUsersActionCreator(response.data.users));
      return { success: true, data: response.data.users };
    } catch (error: any) {
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetUser(id: number) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await userApi.getUserById(id);
      dispatch(setUserActionCreator(response.data.user));
      return { success: true, data: response.data.user };
    } catch (error: any) {
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetProfile() {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsProfileActionCreator(false));
      const response = await userApi.getProfile();
      dispatch(setProfileActionCreator(response.data.user));
      dispatch(setIsProfileActionCreator(true));
      return { success: true, data: response.data.user };
    } catch (error: any) {
      dispatch(setIsProfileActionCreator(false));
      return { success: false, error };
    }
  };
}

export function asyncSetChangeProfile(payload: UpdateProfilePayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsChangeProfileActionCreator(false));
      const response = await userApi.putProfile(payload);
      dispatch(setProfileActionCreator(response.data.user));
      dispatch(setIsChangeProfileActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsChangeProfileActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetChangeProfilePhoto(formData: FormData) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsChangeProfilePhotoActionCreator(false));
      const response = await userApi.postProfilePhoto(formData);
      dispatch(setProfileActionCreator(response.data.user));
      dispatch(setIsChangeProfilePhotoActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsChangeProfilePhotoActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}

export function asyncSetChangeProfilePassword(payload: ChangePasswordPayload) {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsChangeProfilePasswordActionCreator(false));
      const response = await userApi.putPassword(payload);
      dispatch(setIsChangeProfilePasswordActionCreator(true));
      return { success: true, data: response.data };
    } catch (error: any) {
      dispatch(setIsChangeProfilePasswordActionCreator(false));
      await showErrorDialog(error.message);
      return { success: false, error };
    }
  };
}
