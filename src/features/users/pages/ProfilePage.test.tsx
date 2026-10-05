import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { ProfilePage } from "./ProfilePage";
import * as usersAction from "@/features/users/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  formatDate: vi.fn(() => "01 Jan 2024"),
}));

describe("ProfilePage", () => {
  const mockProfile = {
    id: 1,
    name: "John Delcom",
    email: "john@delcom.org",
    photo: "https://example.com/photo.jpg",
    email_verified_at: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch profile on mount if profile is not present", () => {
    const spy = vi.spyOn(usersAction, "asyncSetProfile").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: null,
      },
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should render initials if user photo is null", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: { ...mockProfile, photo: null },
      },
    });

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should update profile info successfully", async () => {
    vi.spyOn(usersAction, "asyncSetChangeProfile").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const nameInput = screen.getByLabelText("Nama Lengkap");
    const emailInput = screen.getByLabelText("Alamat Email");
    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });

    fireEvent.change(nameInput, { target: { value: "John Updated" } });
    fireEvent.change(emailInput, { target: { value: "john.updated@delcom.org" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(usersAction.asyncSetChangeProfile).toHaveBeenCalledWith({
        name: "John Updated",
        email: "john.updated@delcom.org",
      });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Profil berhasil diperbarui"
      );
    });
  });

  it("should validate profile info when fields are empty", async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const nameInput = screen.getByLabelText("Nama Lengkap");
    fireEvent.change(nameInput, { target: { value: "" } });
    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Nama dan email wajib diisi"
      );
    });
  });

  it("should handle photo selection, upload, cancellation, and failed upload", async () => {
    const uploadSpy = vi.spyOn(usersAction, "asyncSetChangeProfilePhoto")
      .mockImplementationOnce(() => async () => ({ success: false }))
      .mockImplementationOnce(() => async () => ({ success: true }));

    const { container } = renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const fileInput = container.querySelector("#photo-upload") as HTMLInputElement;
    const file = new File(["dummy content"], "avatar.png", { type: "image/png" });

    // Select and cancel
    fireEvent.change(fileInput, { target: { files: [file] } });
    const cancelBtn = screen.getByRole("button", { name: /Batal/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByRole("button", { name: /Simpan Foto Baru/i })).not.toBeInTheDocument();

    // Select and failed upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    const savePhotoBtn1 = screen.getByRole("button", { name: /Simpan Foto Baru/i });
    fireEvent.click(savePhotoBtn1);
    await waitFor(() => expect(uploadSpy).toHaveBeenCalledTimes(1));

    // Select and successful upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    const savePhotoBtn2 = screen.getByRole("button", { name: /Simpan Foto Baru/i });
    fireEvent.click(savePhotoBtn2);
    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Foto profil berhasil diperbarui"
      );
    });
  });

  it("should validate and update password, handling failure as well", async () => {
    const passwordSpy = vi.spyOn(usersAction, "asyncSetChangeProfilePassword")
      .mockImplementationOnce(() => async () => ({ success: false }))
      .mockImplementationOnce(() => async () => ({ success: true }));

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const currentPass = screen.getByLabelText("Kata Sandi Saat Ini");
    const newPass = screen.getByLabelText("Kata Sandi Baru");
    const confirmPass = screen.getByLabelText("Konfirmasi Kata Sandi Baru");
    const submitBtn = screen.getByRole("button", { name: /Ubah Kata Sandi/i });

    // Empty validation
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Semua kolom kata sandi wajib diisi"
      );
    });

    // Too short validation
    fireEvent.change(currentPass, { target: { value: "old123" } });
    fireEvent.change(newPass, { target: { value: "123" } });
    fireEvent.change(confirmPass, { target: { value: "123" } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Kata sandi baru minimal harus 6 karakter"
      );
    });

    // Mismatch validation
    fireEvent.change(newPass, { target: { value: "newpass123" } });
    fireEvent.change(confirmPass, { target: { value: "mismatch" } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Konfirmasi kata sandi baru tidak sesuai"
      );
    });

    // Failed submit
    fireEvent.change(confirmPass, { target: { value: "newpass123" } });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(passwordSpy).toHaveBeenCalledTimes(1));

    // Success submit
    fireEvent.change(currentPass, { target: { value: "old123" } });
    fireEvent.change(newPass, { target: { value: "newpass123" } });
    fireEvent.change(confirmPass, { target: { value: "newpass123" } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Kata sandi akun Anda berhasil diubah"
      );
    });
  });

  it("should handle profile update failure, empty file selection, and null profile fallbacks", async () => {
    // 1. Profile update failure
    const updateSpy = vi.spyOn(usersAction, "asyncSetChangeProfile").mockImplementationOnce(
      () => async () => ({ success: false })
    );

    const { container } = renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).not.toHaveBeenCalledWith(
        "Berhasil",
        "Profil berhasil diperbarui"
      );
    });

    // 2. Empty file selection
    const fileInput = container.querySelector("#photo-upload") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(screen.queryByRole("button", { name: /Simpan Foto Baru/i })).not.toBeInTheDocument();
  });

  it("should render fallback initial U when profile name is empty and photo is null", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: {
          ...mockProfile,
          name: "",
          photo: null,
        },
      },
    });

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("should show fallback alt text when photo preview is active but profile has no name", () => {
    const { container } = renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: {
          ...mockProfile,
          name: "",
          photo: null,
        },
      },
    });

    const fileInput = container.querySelector("#photo-upload") as HTMLInputElement;
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
  });
});

