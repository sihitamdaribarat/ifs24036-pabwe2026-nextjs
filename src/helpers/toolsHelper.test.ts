import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SweetAlert Dialog Helpers", () => {
    it("should call Swal.fire with success configuration", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      await showSuccessDialog("Operasi Berhasil", "Detail pesan sukses");
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "success",
        title: "Operasi Berhasil",
        text: "Detail pesan sukses",
        confirmButtonColor: "#3b82f6",
      });
    });

    it("should call Swal.fire with error configuration", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      await showErrorDialog("Terjadi Kesalahan", "Pesan error");
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Pesan error",
        confirmButtonColor: "#ef4444",
      });
    });

    it("should call Swal.fire with warning configuration", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      await showWarningDialog("Peringatan", "Pesan peringatan");
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "warning",
        title: "Peringatan",
        text: "Pesan peringatan",
        confirmButtonColor: "#f59e0b",
      });
    });

    it("should return true when confirm dialog is confirmed with custom button text", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      const result = await showConfirmDialog(
        "Hapus Data?",
        "Data akan dihapus permanen",
        "Ya, Hapus"
      );

      expect(result).toBe(true);
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Hapus Data?",
        text: "Data akan dihapus permanen",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });
    });

    it("should return false when confirm dialog is cancelled using default button text", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);

      const result = await showConfirmDialog("Lanjutkan?");
      expect(result).toBe(false);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmButtonText: "Ya, lanjutkan",
        })
      );
    });
  });

  describe("formatDate", () => {
    it("should return '-' for empty or null dates", () => {
      expect(formatDate("")).toBe("-");
      // @ts-ignore
      expect(formatDate(null)).toBe("-");
    });

    it("should return '-' for invalid date strings", () => {
      expect(formatDate("bukan-tanggal-valid")).toBe("-");
    });

    it("should format valid ISO date strings correctly", () => {
      const result = formatDate("2024-10-05T03:07:11.000000Z");
      expect(result).toBeDefined();
      expect(result).not.toBe("-");
      expect(result).toContain("2024");
    });
  });
});
