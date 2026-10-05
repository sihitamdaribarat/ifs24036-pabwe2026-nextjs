import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { NavbarComponent } from "./NavbarComponent";
import * as toolsHelper from "@/helpers/toolsHelper";
import * as authAction from "@/features/auth/states/action";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("NavbarComponent", () => {
  const mockProfileWithPhoto = {
    id: 1,
    name: "John Doe",
    email: "john@delcom.org",
    photo: "https://example.com/avatar.jpg",
    email_verified_at: null,
    created_at: "",
    updated_at: "",
  };

  const mockProfileWithoutPhoto = {
    ...mockProfileWithPhoto,
    photo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render profile avatar and name with photo", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: { profile: mockProfileWithPhoto },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();
  });

  it("should render initial fallback when photo is null", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: { profile: mockProfileWithoutPhoto },
    });

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should toggle sidebar when mobile toggle button is clicked", () => {
    const onToggleSidebar = vi.fn();
    renderWithProviders(
      <NavbarComponent onToggleSidebar={onToggleSidebar} />
    );

    const toggleBtn = screen.getByLabelText("Toggle Sidebar");
    fireEvent.click(toggleBtn);
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("should open dropdown menu and trigger logout upon confirmation", async () => {
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(true);
    vi.spyOn(authAction, "asyncSetAuthLogout").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<NavbarComponent />, {
      preloadedState: { profile: mockProfileWithPhoto },
    });

    const userMenuBtn = screen.getByLabelText("User Menu");
    fireEvent.click(userMenuBtn);

    const logoutBtn = screen.getByRole("button", { name: /Keluar/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
      expect(authAction.asyncSetAuthLogout).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Anda telah keluar dari aplikasi"
      );
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should cancel logout when user declines confirmation", async () => {
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(false);
    const logoutSpy = vi.spyOn(authAction, "asyncSetAuthLogout");

    renderWithProviders(<NavbarComponent />, {
      preloadedState: { profile: mockProfileWithPhoto },
    });

    const userMenuBtn = screen.getByLabelText("User Menu");
    fireEvent.click(userMenuBtn);

    const logoutBtn = screen.getByRole("button", { name: /Keluar/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
      expect(logoutSpy).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should close dropdown when clicking Profil Saya link", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: { profile: mockProfileWithPhoto },
    });

    const userMenuBtn = screen.getByLabelText("User Menu");
    fireEvent.click(userMenuBtn);

    const profileLink = screen.getByText("Profil Saya");
    fireEvent.click(profileLink);

    expect(screen.queryByText("Profil Saya")).not.toBeInTheDocument();
  });
});
