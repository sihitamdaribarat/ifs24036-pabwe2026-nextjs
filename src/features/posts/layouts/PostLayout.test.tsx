import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { PostLayout } from "./PostLayout";
import * as apiHelper from "@/helpers/apiHelper";
import * as usersAction from "@/features/users/states/action";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
  usePathname: () => "/",
}));

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to /auth/login when token is not present", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(
      <PostLayout>
        <div>Protected Content</div>
      </PostLayout>
    );

    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    expect(screen.getByTestId("post-layout-loading")).toBeInTheDocument();
  });

  it("should render layout and fetch profile when token is present", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const profileSpy = vi.spyOn(usersAction, "asyncSetProfile").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(
      <PostLayout>
        <div data-testid="dashboard-content">Protected Content</div>
      </PostLayout>,
      { preloadedState: { profile: null } }
    );

    expect(profileSpy).toHaveBeenCalled();
    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    expect(screen.getByText("Delcom Posts")).toBeInTheDocument();
  });

  it("should toggle sidebar drawer on mobile", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    renderWithProviders(
      <PostLayout>
        <div>Content</div>
      </PostLayout>
    );

    const toggleBtn = screen.getByLabelText("Toggle Sidebar");
    fireEvent.click(toggleBtn);

    // Sidebar backdrop should become visible, click it to close
    const backdrop = screen.getByRole("presentation");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("should not refetch profile if profile is already present in store", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const profileSpy = vi.spyOn(usersAction, "asyncSetProfile");

    renderWithProviders(
      <PostLayout>
        <div>Content</div>
      </PostLayout>,
      {
        preloadedState: {
          profile: {
            id: 1,
            name: "John",
            email: "john@example.com",
            photo: null,
            created_at: "",
            updated_at: "",
          },
        },
      }
    );

    expect(profileSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Delcom Posts")).toBeInTheDocument();
  });
});
