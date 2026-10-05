import { describe, it, expect, vi, beforeEach } from "vitest";
import { postLogin, postRegister, postLogout, authApi } from "./authApi";
import * as apiHelper from "@/helpers/apiHelper";

vi.mock("@/helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call POST /auth/login with credentials payload", async () => {
    const mockResult = {
      status: "success",
      data: { token: "token123" },
    };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockResult);

    const payload = { email: "user@delcom.org", password: "secretpassword" };
    const res = await postLogin(payload);

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(res).toBe(mockResult);
  });

  it("should call POST /auth/register with user registration payload", async () => {
    const mockResult = {
      status: "success",
      message: "Berhasil daftar",
    };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockResult);

    const payload = {
      name: "Delcom User",
      email: "user@delcom.org",
      password: "secretpassword",
    };
    const res = await postRegister(payload);

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(res).toBe(mockResult);
  });

  it("should call POST /auth/logout", async () => {
    const mockResult = {
      status: "success",
      message: "Berhasil logout",
    };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockResult);

    const res = await postLogout();

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/auth/logout", {
      method: "POST",
    });
    expect(res).toBe(mockResult);
  });

  it("should expose aliases on default authApi object", () => {
    expect(authApi.login).toBe(postLogin);
    expect(authApi.register).toBe(postRegister);
    expect(authApi.logout).toBe(postLogout);
  });
});
