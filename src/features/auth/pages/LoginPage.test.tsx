import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { LoginPage } from "./LoginPage";
import * as toolsHelper from "@/helpers/toolsHelper";
import * as authAction from "@/features/auth/states/action";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form elements correctly", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Selamat Datang Kembali")).toBeInTheDocument();
    expect(screen.getByLabelText("Alamat Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Masuk Sekarang/i })
    ).toBeInTheDocument();
  });

  it("should show validation error if email or password is empty", async () => {
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /Masuk Sekarang/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Email dan kata sandi wajib diisi"
      );
    });
  });

  it("should call asyncSetAuthLogin and redirect upon successful submission", async () => {
    vi.spyOn(authAction, "asyncSetAuthLogin").mockImplementation(
      () =>
        async () => ({ success: true })
    );

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText("Alamat Email");
    const passwordInput = screen.getByLabelText("Kata Sandi");
    const submitBtn = screen.getByRole("button", { name: /Masuk Sekarang/i });

    fireEvent.change(emailInput, { target: { value: "test@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authAction.asyncSetAuthLogin).toHaveBeenCalledWith({
        email: "test@delcom.org",
        password: "password123",
      });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil Masuk",
        "Selamat datang kembali!"
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should not redirect if login failed", async () => {
    vi.spyOn(authAction, "asyncSetAuthLogin").mockImplementation(
      () =>
        async () => ({ success: false })
    );

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText("Alamat Email");
    const passwordInput = screen.getByLabelText("Kata Sandi");
    const submitBtn = screen.getByRole("button", { name: /Masuk Sekarang/i });

    fireEvent.change(emailInput, { target: { value: "test@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authAction.asyncSetAuthLogin).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
