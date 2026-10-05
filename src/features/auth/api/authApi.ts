import { fetchApi } from "@/helpers/apiHelper";
import { ApiResult, AuthLoginResponseData } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types/action";

export async function postLogin(
  payload: LoginPayload
): Promise<ApiResult<AuthLoginResponseData>> {
  return fetchApi<ApiResult<AuthLoginResponseData>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postRegister(
  payload: RegisterPayload
): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postLogout(): Promise<ApiResult<unknown>> {
  return fetchApi<ApiResult<unknown>>("/auth/logout", {
    method: "POST",
  });
}

export const authApi = {
  postLogin,
  postRegister,
  postLogout,
  login: postLogin,
  register: postRegister,
  logout: postLogout,
};

export default authApi;
