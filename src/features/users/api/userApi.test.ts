import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUsers,
  getUserById,
  getProfile,
  putProfile,
  postProfilePhoto,
  putPassword,
  userApi,
} from "./userApi";
import * as apiHelper from "@/helpers/apiHelper";

vi.mock("@/helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("userApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUsers should fetch GET /users", async () => {
    const mockData = { status: "success", data: { users: [] } };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const res = await getUsers();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users");
    expect(res).toBe(mockData);
  });

  it("getUserById should fetch GET /users/:id", async () => {
    const mockData = { status: "success", data: { user: { id: 5 } } };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const res = await getUserById(5);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/5");
    expect(res).toBe(mockData);
  });

  it("getProfile should fetch GET /users/me", async () => {
    const mockData = { status: "success", data: { user: { id: 1 } } };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const res = await getProfile();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me");
    expect(res).toBe(mockData);
  });

  it("putProfile should send PUT /users/me with payload", async () => {
    const mockData = { status: "success", data: { user: { id: 1 } } };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const payload = { name: "Updated Name", email: "updated@delcom.org" };
    const res = await putProfile(payload);

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    expect(res).toBe(mockData);
  });

  it("postProfilePhoto should send POST /users/me/photo with formData", async () => {
    const mockData = { status: "success" };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const formData = new FormData();
    formData.append("photo", "dummy");

    const res = await postProfilePhoto(formData);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me/photo", {
      method: "POST",
      body: formData,
    });
    expect(res).toBe(mockData);
  });

  it("putPassword should send PUT /users/password", async () => {
    const mockData = { status: "success" };
    vi.mocked(apiHelper.fetchApi).mockResolvedValue(mockData);

    const payload = {
      password: "old",
      new_password: "new",
      new_password_confirmation: "new",
    };
    const res = await putPassword(payload);

    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    expect(res).toBe(mockData);
  });

  it("putPassword should fallback to /users/me/password if /users/password is not found", async () => {
    const notFoundError = new Error("Sumber ini tidak tersedia");
    (notFoundError as any).response = { message: "Sumber ini tidak tersedia" };

    const mockData = { status: "success" };
    vi.mocked(apiHelper.fetchApi)
      .mockRejectedValueOnce(notFoundError)
      .mockResolvedValueOnce(mockData);

    const payload = {
      password: "old",
      new_password: "new",
      new_password_confirmation: "new",
    };
    const res = await putPassword(payload);

    expect(apiHelper.fetchApi).toHaveBeenNthCalledWith(1, "/users/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    expect(apiHelper.fetchApi).toHaveBeenNthCalledWith(2, "/users/me/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    expect(res).toBe(mockData);
  });

  it("putPassword should rethrow other errors", async () => {
    const generalError = new Error("Kata sandi lama salah");
    vi.mocked(apiHelper.fetchApi).mockRejectedValue(generalError);

    const payload = {
      password: "old",
      new_password: "new",
      new_password_confirmation: "new",
    };
    await expect(putPassword(payload)).rejects.toThrow("Kata sandi lama salah");
  });

  it("should expose userApi methods on object", () => {
    expect(userApi.getUsers).toBe(getUsers);
    expect(userApi.getUserById).toBe(getUserById);
    expect(userApi.getProfile).toBe(getProfile);
    expect(userApi.putProfile).toBe(putProfile);
    expect(userApi.postProfilePhoto).toBe(postProfilePhoto);
    expect(userApi.putPassword).toBe(putPassword);
  });
});
