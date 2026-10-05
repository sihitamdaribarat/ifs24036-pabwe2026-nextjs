import { ActionType } from "@/features/users/states/action";
import { User } from "@/types";

export function usersReducer(
  state: User[] = [],
  action: any = {}
): User[] {
  switch (action.type) {
    case ActionType.SET_USERS:
      return action.payload.users;
    default:
      return state;
  }
}

export function userReducer(
  state: User | null = null,
  action: any = {}
): User | null {
  switch (action.type) {
    case ActionType.SET_USER:
      return action.payload.user;
    default:
      return state;
  }
}

export function profileReducer(
  state: User | null = null,
  action: any = {}
): User | null {
  switch (action.type) {
    case ActionType.SET_PROFILE:
      return action.payload.profile;
    default:
      return state;
  }
}

export function isProfileReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_PROFILE:
      return action.payload.isProfile;
    default:
      return state;
  }
}

export function isChangeProfileReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE:
      return action.payload.isChangeProfile;
    default:
      return state;
  }
}

export function isChangeProfilePhotoReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PHOTO:
      return action.payload.isChangeProfilePhoto;
    default:
      return state;
  }
}

export function isChangeProfilePasswordReducer(
  state: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PASSWORD:
      return action.payload.isChangeProfilePassword;
    default:
      return state;
  }
}

export const users = usersReducer;
export const user = userReducer;
export const profile = profileReducer;
export const isProfile = isProfileReducer;
export const isChangeProfile = isChangeProfileReducer;
export const isChangeProfilePhoto = isChangeProfilePhotoReducer;
export const isChangeProfilePassword = isChangeProfilePasswordReducer;
