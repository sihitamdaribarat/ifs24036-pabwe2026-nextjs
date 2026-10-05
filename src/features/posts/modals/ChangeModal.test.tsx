import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { ChangeModal } from "./ChangeModal";
import * as postsAction from "@/features/posts/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("ChangeModal", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal isOpen={false} onClose={onClose} postId={1} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should validate empty description", async () => {
    renderWithProviders(
      <ChangeModal
        isOpen={true}
        onClose={onClose}
        postId={1}
        initialDescription="Initial"
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "" } });

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Deskripsi postingan tidak boleh kosong"
      );
    });
  });

  it("should update post description and call onSuccess and onClose", async () => {
    vi.spyOn(postsAction, "asyncSetPostChange").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(
      <ChangeModal
        isOpen={true}
        onClose={onClose}
        postId={10}
        initialDescription="Initial text"
        onSuccess={onSuccess}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Updated text" } });

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChange).toHaveBeenCalledWith({
        id: 10,
        description: "Updated text",
      });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Postingan berhasil diperbarui!"
      );
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("should update post description without onSuccess callback", async () => {
    vi.spyOn(postsAction, "asyncSetPostChange").mockImplementation(
      () => async () => ({ success: true })
    );

    renderWithProviders(
      <ChangeModal
        isOpen={true}
        onClose={onClose}
        postId={10}
        initialDescription="Initial text"
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not close modal or call onSuccess if post update fails", async () => {
    vi.spyOn(postsAction, "asyncSetPostChange").mockImplementation(
      () => async () => ({ success: false })
    );

    renderWithProviders(
      <ChangeModal
        isOpen={true}
        onClose={onClose}
        postId={10}
        initialDescription="Initial text"
        onSuccess={onSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChange).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
