import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { ChangeCoverModal } from "./ChangeCoverModal";
import * as postsAction from "@/features/posts/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("ChangeCoverModal", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen={false} onClose={onClose} postId={1} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should validate if upload is clicked without selecting file", async () => {
    renderWithProviders(
      <ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />
    );

    const uploadBtn = screen.getByRole("button", { name: /Unggah Cover/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Validasi Gagal",
        "Pilih file gambar cover terlebih dahulu"
      );
    });
  });

  it("should handle file selection and preview", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />
    );

    const fileInput = container.querySelector("#cover-file") as HTMLInputElement;
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("Pratinjau Baru")).toBeInTheDocument();
  });

  it("should cancel and close modal", () => {
    renderWithProviders(
      <ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />
    );

    const cancelBtn = screen.getByRole("button", { name: /Batal/i });
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it("should upload selected cover file and notify success with and without onSuccess", async () => {
    vi.spyOn(postsAction, "asyncSetPostChangeCover").mockImplementation(
      () => async () => ({ success: true })
    );

    // With onSuccess
    const { container, unmount } = renderWithProviders(
      <ChangeCoverModal
        isOpen={true}
        onClose={onClose}
        postId={5}
        onSuccess={onSuccess}
      />
    );

    const fileInput = container.querySelector("#cover-file") as HTMLInputElement;
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadBtn = screen.getByRole("button", { name: /Unggah Cover/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChangeCover).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Berhasil",
        "Cover postingan berhasil diperbarui!"
      );
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    unmount();

    // Without onSuccess
    const { container: container2 } = renderWithProviders(
      <ChangeCoverModal
        isOpen={true}
        onClose={onClose}
        postId={5}
      />
    );

    const fileInput2 = container2.querySelector("#cover-file") as HTMLInputElement;
    fireEvent.change(fileInput2, { target: { files: [file] } });
    const uploadBtn2 = screen.getByRole("button", { name: /Unggah Cover/i });
    fireEvent.click(uploadBtn2);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should handle file input change when no file is selected", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />
    );

    const fileInput = container.querySelector("#cover-file") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(screen.queryByText("Pratinjau Baru")).not.toBeInTheDocument();
  });

  it("should not close modal or call onSuccess if upload fails", async () => {
    vi.spyOn(postsAction, "asyncSetPostChangeCover").mockImplementation(
      () => async () => ({ success: false })
    );

    const { container } = renderWithProviders(
      <ChangeCoverModal
        isOpen={true}
        onClose={onClose}
        postId={5}
        onSuccess={onSuccess}
      />
    );

    const fileInput = container.querySelector("#cover-file") as HTMLInputElement;
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadBtn = screen.getByRole("button", { name: /Unggah Cover/i });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(postsAction.asyncSetPostChangeCover).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
