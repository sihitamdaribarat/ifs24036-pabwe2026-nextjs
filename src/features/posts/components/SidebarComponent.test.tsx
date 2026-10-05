import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { SidebarComponent } from "./SidebarComponent";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SidebarComponent", () => {
  it("should render navigation items", () => {
    renderWithProviders(<SidebarComponent isOpen={false} onClose={vi.fn()} />);

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should handle mobile drawer open, close, and backdrop click", () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(
      <SidebarComponent isOpen={true} onClose={onClose} />
    );

    // Backdrop should exist when open
    const backdrop = screen.getByRole("presentation");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();

    // Close button click
    const closeBtn = screen.getByLabelText("Tutup Menu");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(2);

    // Nav link click
    const link = screen.getByText("Daftar Pengguna");
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalledTimes(3);

    // Rerender closed
    rerender(<SidebarComponent isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });
});
