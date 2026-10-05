import { fetchApi } from "@/helpers/apiHelper";
import {
  ApiResult,
  User,
  UsersResponseData,
  UserResponseData,
} from "@/types";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/types/action";

export async function getUsers(): Promise<ApiResult<UsersResponseData>> {
  return fetchApi<ApiResult<UsersResponseData>>("/users");
}

export async function getUserById(
  id: number
): Promise<ApiResult<UserResponseData>> {
  return fetchApi<ApiResult<UserResponseData>>(`/users/${id}`);
}

export async function getProfile(): Promise<ApiResult<UserResponseData>> {
  return fetchApi<ApiResult<UserResponseData>>("/users/me");
}

export async function putProfile(
  payload: UpdateProfilePayload
): Promise<ApiResult<UserResponseData>> {
  return fetchApi<ApiResult<UserResponseData>>("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function postProfilePhoto(
  formData: FormData
): Promise<ApiResult<UserResponseData>> {
  return fetchApi<ApiResult<UserResponseData>>("/users/me/photo", {
    method: "POST",
    body: formData,
  });
}

export async function putPassword(
  payload: ChangePasswordPayload
): Promise<ApiResult<unknown>> {
  try {
    return await fetchApi<ApiResult<unknown>>("/users/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    if (err?.response?.message === "Sumber ini tidak tersedia") {
      return await fetchApi<ApiResult<unknown>>("/users/me/password", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
    throw err;
  }
}

export const userApi = {
  getUsers,
  getUserById,
  getProfile,
  putProfile,
  postProfilePhoto,
  putPassword,
};

export default userApi;
