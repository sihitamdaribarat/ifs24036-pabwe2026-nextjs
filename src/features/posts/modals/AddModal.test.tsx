import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { AddModal } from "./AddModal";
import * as postsAction from "@/features/posts/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("AddModal", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if isOpen is false", () => {
    const { container } = renderWithProviders(
      <AddModal isOpen={false} onClose={onClose} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should validate empty description", async () => {
    renderWithProviders(<AddModal isOpen={true} onClose={onClose} />);

    const submitBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Deskripsi postingan tidak boleh kosong"
      );
    });
  });

  it("should create new post and call onSuccess and onClose", async () => {
    vi.spyOn(postsAction, "asyncSetPostAdd").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(
      <AddModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />
    );

    const textarea = screen.getByPlaceholderText(
      /Tuliskan pemikiran, cerita, atau ide menarik Anda.../i
    );
    fireEvent.change(textarea, { target: { value: "Postingan pertama" } });

    const submitBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostAdd).toHaveBeenCalledWith({
        description: "Postingan pertama",
      });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Postingan baru berhasil diterbitkan!"
      );
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("should create new post without onSuccess callback", async () => {
    vi.spyOn(postsAction, "asyncSetPostAdd").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(<AddModal isOpen={true} onClose={onClose} />);

    const textarea = screen.getByPlaceholderText(
      /Tuliskan pemikiran, cerita, atau ide menarik Anda.../i
    );
    fireEvent.change(textarea, { target: { value: "Postingan kedua" } });

    const submitBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not close modal or call onSuccess if post creation fails", async () => {
    vi.spyOn(postsAction, "asyncSetPostAdd").mockImplementation(
      () => async () => ({ success: false })
    );

    renderWithProviders(
      <AddModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />
    );

    const textarea = screen.getByPlaceholderText(
      /Tuliskan pemikiran, cerita, atau ide menarik Anda.../i
    );
    fireEvent.change(textarea, { target: { value: "Postingan gagal" } });

    const submitBtn = screen.getByRole("button", { name: /Publikasikan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
