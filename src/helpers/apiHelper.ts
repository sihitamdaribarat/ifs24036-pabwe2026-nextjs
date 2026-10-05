import { DELCOM_BASEURL } from "@/lib/config";

export const ACCESS_TOKEN_KEY = "DELCOM_TOKEN";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function removeAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export interface FetchApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchApiOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...restOptions } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${DELCOM_BASEURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAccessToken();
  const headers = new Headers(customHeaders || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    restOptions.body &&
    !(restOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.status === "fail" || data.status === "error") {
    const errorMessage =
      data.message ||
      (data.data && typeof data.data === "object"
        ? Object.values(data.data).flat().join(", ")
        : "Terjadi kesalahan pada server");
    const error = new Error(errorMessage);
    (error as unknown as { response: unknown }).response = data;
    throw error;
  }

  return data as T;
}
