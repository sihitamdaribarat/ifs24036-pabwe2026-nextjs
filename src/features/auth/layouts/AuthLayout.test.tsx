import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthLayout } from "./AuthLayout";
import * as apiHelper from "@/helpers/apiHelper";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
}));

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to '/' when user is already logged in", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    render(
      <AuthLayout>
        <div data-testid="auth-child">Auth Child Content</div>
      </AuthLayout>
    );

    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(screen.queryByTestId("auth-child")).not.toBeInTheDocument();
  });

  it("should render visual banner and children when user is not logged in", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    render(
      <AuthLayout>
        <div data-testid="auth-child">Auth Child Content</div>
      </AuthLayout>
    );

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByTestId("auth-child")).toBeInTheDocument();
    expect(screen.getByText("Delcom Posts")).toBeInTheDocument();
    expect(
      screen.getByText("Bagikan Pemikiran dan Terhubung dengan Komunitas")
    ).toBeInTheDocument();
  });
});
