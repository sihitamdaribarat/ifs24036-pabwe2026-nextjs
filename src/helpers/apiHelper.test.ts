import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  fetchApi,
  ACCESS_TOKEN_KEY,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Token Management", () => {
    it("should store, get, and remove access token correctly", () => {
      expect(getAccessToken()).toBeNull();

      putAccessToken("mock-token-123");
      expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("mock-token-123");
      expect(getAccessToken()).toBe("mock-token-123");

      removeAccessToken();
      expect(getAccessToken()).toBeNull();
      expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    });

    it("should handle SSR when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(getAccessToken()).toBeNull();
      putAccessToken("ssr-token");
      removeAccessToken();

      global.window = originalWindow;
    });
  });

  describe("fetchApi", () => {
    it("should successfully fetch with relative URL and return json", async () => {
      const mockResponseData = {
        status: "success",
        message: "Berhasil",
        data: { id: 1 },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await fetchApi("/posts");
      expect(result).toEqual(mockResponseData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/posts"),
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );
    });

    it("should support relative URL without leading slash and empty params", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "success" }),
      });

      await fetchApi("posts", { params: {} });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/posts$/),
        expect.any(Object)
      );
    });

    it("should support absolute URLs and query parameters without existing '?'", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "success", data: [] }),
      });

      await fetchApi("https://example.com/api/test", {
        params: { is_me: 1, search: "hello", skip: undefined, nullVal: null },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test?is_me=1&search=hello",
        expect.any(Object)
      );
    });

    it("should append query parameters when URL already contains '?'", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "success" }),
      });

      await fetchApi("https://example.com/api/test?page=1", {
        params: { limit: 10 },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test?page=1&limit=10",
        expect.any(Object)
      );
    });

    it("should attach Authorization Bearer token when token is present", async () => {
      putAccessToken("user-token-xyz");

      let sentHeaders: Headers | undefined;
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        sentHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: "success" }),
        });
      });

      await fetchApi("/users/me");
      expect(sentHeaders?.get("Authorization")).toBe("Bearer user-token-xyz");
    });

    it("should respect existing Authorization header if already provided", async () => {
      putAccessToken("token-to-ignore");

      let sentHeaders: Headers | undefined;
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        sentHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: "success" }),
        });
      });

      await fetchApi("/users/me", {
        headers: { Authorization: "CustomAuth custom-value" },
      });
      expect(sentHeaders?.get("Authorization")).toBe("CustomAuth custom-value");
    });

    it("should auto-set Content-Type application/json for non-FormData body", async () => {
      let sentHeaders: Headers | undefined;
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        sentHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: "success" }),
        });
      });

      await fetchApi("/posts", {
        method: "POST",
        body: JSON.stringify({ title: "Test" }),
      });
      expect(sentHeaders?.get("Content-Type")).toBe("application/json");
    });

    it("should not override Content-Type for FormData body", async () => {
      let sentHeaders: Headers | undefined;
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        sentHeaders = options.headers;
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: "success" }),
        });
      });

      const formData = new FormData();
      formData.append("file", "dummy");

      await fetchApi("/posts/1/cover", {
        method: "POST",
        body: formData,
      });
      expect(sentHeaders?.get("Content-Type")).toBeNull();
    });

    it("should throw error with message if status is fail", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "fail",
          message: "Kredensial tidak valid",
        }),
      });

      await expect(fetchApi("/auth/login")).rejects.toThrow(
        "Kredensial tidak valid"
      );
    });

    it("should throw validation errors combined if status is fail with validation object", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "fail",
          data: {
            email: ["Email sudah terdaftar"],
            password: ["Password terlalu pendek"],
          },
        }),
      });

      await expect(fetchApi("/auth/register")).rejects.toThrow(
        "Email sudah terdaftar, Password terlalu pendek"
      );
    });

    it("should fallback to default error message if response is not ok and no message provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      });

      await expect(fetchApi("/unknown")).rejects.toThrow(
        "Terjadi kesalahan pada server"
      );
    });
  });
});
