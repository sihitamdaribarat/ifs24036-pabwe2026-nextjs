import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { RegisterPage } from "./RegisterPage";
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

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render registration form elements", () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByText("Buat Akun Baru")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama Lengkap")).toBeInTheDocument();
    expect(screen.getByLabelText("Alamat Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
    expect(screen.getByLabelText("Konfirmasi Kata Sandi")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Daftar Akun/i })
    ).toBeInTheDocument();
  });

  it("should show validation error if required fields are missing", async () => {
    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByRole("button", { name: /Daftar Akun/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Nama, email, dan kata sandi wajib diisi"
      );
    });
  });

  it("should show validation error if password is less than 6 characters", async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama Lengkap"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Alamat Email"), {
      target: { value: "john@delcom.org" },
    });
    fireEvent.change(screen.getByLabelText("Kata Sandi"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Konfirmasi Kata Sandi"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Daftar Akun/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Kata sandi minimal harus 6 karakter"
      );
    });
  });

  it("should show validation error if passwords do not match", async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama Lengkap"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Alamat Email"), {
      target: { value: "john@delcom.org" },
    });
    fireEvent.change(screen.getByLabelText("Kata Sandi"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Konfirmasi Kata Sandi"), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Daftar Akun/i }));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Konfirmasi kata sandi tidak cocok"
      );
    });
  });

  it("should dispatch asyncSetAuthRegister and navigate to /auth/login on success", async () => {
    vi.spyOn(authAction, "asyncSetAuthRegister").mockImplementation(
      () =>
        async () => ({ success: true })
    );

    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama Lengkap"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Alamat Email"), {
      target: { value: "john@delcom.org" },
    });
    fireEvent.change(screen.getByLabelText("Kata Sandi"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByLabelText("Konfirmasi Kata Sandi"), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Daftar Akun/i }));

    await waitFor(() => {
      expect(authAction.asyncSetAuthRegister).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@delcom.org",
        password: "secret123",
      });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Registrasi Berhasil",
        "Akun Anda telah berhasil didaftarkan. Silakan masuk."
      );
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should not navigate if registration fails", async () => {
    vi.spyOn(authAction, "asyncSetAuthRegister").mockImplementation(
      () =>
        async () => ({ success: false })
    );

    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama Lengkap"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Alamat Email"), {
      target: { value: "john@delcom.org" },
    });
    fireEvent.change(screen.getByLabelText("Kata Sandi"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByLabelText("Konfirmasi Kata Sandi"), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Daftar Akun/i }));

    await waitFor(() => {
      expect(authAction.asyncSetAuthRegister).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
